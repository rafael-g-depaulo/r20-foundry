import { getMaxCapacity } from "../businessLogic/inventory.mjs";
import { getPcMovementSpeed } from "../businessLogic/movement.mjs";
import { getProficiency } from "../businessLogic/proficiency.mjs";
import { groupBy } from "../helpers/array.mjs"
import { multiplyDice } from "../helpers/dice.mjs"
import {
  maxSkillProficiency,
} from "../businessLogic/skills.mjs";
import { CharacterDataModel } from "./character.mjs";
import { ExtraPropertySchema, ExtraSkillSchema } from "./fieldSchemas.mjs";
import { R20 } from "../helpers/config.mjs";
import { getAttributeModifierStr } from "../businessLogic/attributeModifier.mjs"
import { numToBonus } from "../helpers/string.mjs"
import { getDefense, getDodge, getGuard } from "../businessLogic/defenses.mjs";
import { casterKnownSpellsPerLevel, preparedCasterPreparedSpells } from "../businessLogic/spells.mjs";

// TODO: add show prop on extra props
// TODO: refactor extra prop to only be number, and allow max
export class PcDataModel extends CharacterDataModel {
  static defineSchema() {
    const baseCharacterSchema = CharacterDataModel.defineSchema();
    const { ArrayField, NumberField, SchemaField, StringField, BooleanField } = foundry.data.fields;

    return {
      ...baseCharacterSchema,
      level: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 1,
        max: 20,
        initial: 1,
      }),
      extraSkills: new ArrayField(ExtraSkillSchema()),
      extraProperties: new ArrayField(ExtraPropertySchema()),
      config: new SchemaField({
        lv1MaxHp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 1,
          initial: 10,
        }),
        hpPerLevel: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 4,
        }),
        mpPerLevel: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 3,
        }),
        bonusMaxHp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusMaxMp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusMaxFp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        isPaladin: new BooleanField({
          required: true,
          nullable: false,
          initial: false,
        }),
        miraclesAttb: new StringField({
          required: true,
          nullable: false,
          blank: true,
          choices: ["", ...R20.attributeNamesArray],
          initial: "",
        }),
        isCaster: new BooleanField({
          required: true,
          nullable: false,
          initial: false,
        }),
        isPreparedCaster: new BooleanField({
          required: true,
          nullable: false,
          initial: false,
        }),
        spellAttb: new StringField({
          required: true,
          nullable: false,
          blank: true,
          choices: ["", ...R20.attributeNamesArray],
          initial: R20.attributeNames.int,
        }),
        bonusLearnedSpells: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        hasClassSaves: new BooleanField({
          required: true,
          nullable: false,
          initial: false,
        }),
        classSaveAttb: new StringField({
          required: true,
          nullable: false,
          blank: true,
          choices: ["", ...R20.attributeNamesArray],
          initial: "",
        }),
        bonusSkillPoints: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusCapacity: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusDefense: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusGuard: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusDodge: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusMovementSpeed: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        attributeProficiencies: new SchemaField(
          Object.fromEntries(
            R20.attributeNamesArray.map(attb => [
              attb,
              new BooleanField({
                required: true,
                nullable: false,
                initial: false,
                label: attb+"_IS_PROFICIENT_"
              })
            ])
          )
        ),
      }),

      // skill points related stuff (auto calculated)
      // TODO: remove since it's most likely not needed anymore
      maxSkillProficiency: new NumberField({
        required: false,
        nullable: true,
        integer: true,
        min: 1,
        initial: maxSkillProficiency(1),
      }),
      totalSkillPoints: new NumberField({
        required: false,
        nullable: true,
        integer: true,
        min: 1,
      }),
      openSkillPoints: new NumberField({
        required: false,
        nullable: true,
        integer: true,
      }),
    };
  }

  items = []
  populateExternalIds({ items } = {}) {
    super.populateExternalIds({ items })

    const itemsSource = items ?? game.items

    this.attacks.forEach((attack, attackIndex) => {
      const { weaponId } = attack
      const weapon = itemsSource.find(item => item.id === weaponId)

      if (!weapon) {
      // if (!weapon) {
        console.error(`Error trying to find weapon with id ${weaponId}. Deleting attack just to be safe.`)
        this.attacks.splice(attackIndex, 1)
        return
      }

      this.attacks[attackIndex] = { ...attack, weapon, weaponId }
    })
  }

  // update the props that are supposed to be dynamically calcultated
  populateVirtualProps() {
    super.populateVirtualProps()

    // spells
    this.spellsByCircle = groupBy(spell => spell.system.circle, this.spells)

    // attack bonuses
    this.attacks.forEach((attack, attackIndex) => {

      // const toHitProficiency = attack.isProficient ? numToBonus(this.proficiency) : ""
      // const toHitAttribute = attack.attackAttb === "" ? "" : ` ${getAttributeModifierStr(this.attributes[attack.attackAttb])}`

      const toHit = numToBonus(
        (attack.isProficient ? this.proficiency : 0) + this.getAttributeModifier(attack.attackAttb)
      )

      const baseDamage = attack.weapon.system.damage
      const attbDamage = attack.damageAttb === "" ? "" : ` ${getAttributeModifierStr(this.attributes[attack.damageAttb])}`
      const bonusDamage = attack.damageBonus.trim() === "" ? "" : ` + ${attack.damageBonus}`
      const damage = `${baseDamage}${attbDamage}${bonusDamage}`.trim()

      const critMult = attack.weapon.system.critMult + attack.critMult + this.bonus.attack.critMult
      const critMargin = attack.weapon.system.critMargin + attack.critMargin + this.bonus.attack.critMargin
      console.log(critMult, attack.critMult,  attack.weapon.system.critMult)

      const critBaseDamage = multiplyDice(attack.weapon.system.damage, critMult)
      const critDamage = `${critBaseDamage}${attbDamage}${bonusDamage}`.trim()

      this.attacks[attackIndex].toHit = toHit + this.bonus.attack.toHit
      this.attacks[attackIndex].damageStr = damage + this.bonus.attack.damage
      this.attacks[attackIndex].critDamageStr = critDamage + this.bonus.attack.damage
      this.attacks[attackIndex].critMultTotal = critMult
      this.attacks[attackIndex].critMarginTotal = critMargin
    })

    // update skill total bonus
    Object.entries(this.skills).forEach(([skillName, skill]) => {
      this.skills[skillName].total =
        skill.proficiency +
        skill.bonus +
        this.getAttributeModifier(skill.attribute);
    });

    // extra props
    this.extraProperties.forEach(({ name, type, value }) => {
      const parsedValue = type === 'number' ? Number(value) : value
      this.extra[name] = parsedValue
    })
  }

  get isEncumbered() {
    return (this.currentCapacity / this.itemCapacity) >= 1
  }
  get movementSpeed() {
    return getPcMovementSpeed(this.STR, this.config.bonusMovementSpeed, this.isEncumbered)
  }

  get proficiency() {
    return getProficiency(this.level)
  }
  set proficiency(a) { }
  get maxSkillProficiency() {
    return maxSkillProficiency(this.level);
  }
  set maxSkillProficiency(a) { }

  // Not needed yet to override
  // get defense() {}
  // get guard() {}
  // get dodge() {}

  updateMaxResources() {
    this.resources.hp.max =
      this.config.lv1MaxHp +
      this.config.hpPerLevel * (this.level - 1) +
      this.level * this.CON +
      this.config.bonusMaxHp;
    this.resources.mp.max =
      this.config.mpPerLevel * this.level + this.config.bonusMaxMp;
    this.resources.fp.max = 5 * this.level + this.config.bonusMaxFp;
  }

  get currentCapacity() {
    if (!this.items) {
      console.error("Tried getting item capacity but item list not given...", this)
      return -1
    }

    const curCapacity = this.actualItems
      .map(({ system }) => (isNaN(system.weight) ? 0 : system.weight) * system.quantity)
      .reduce((a, b) => a + b, 0)

    return curCapacity
  }

  get itemCapacity() {
    return getMaxCapacity(this)
  }

  extra = {};
  populateExtraProps() {
    // // populate the extra props
    // this.extraProperties.forEach(({ name, type, value }) => {
    //   this.extra[name] =
    //     type === "number"
    //       ? Number(value)
    //       : type === "bool"
    //         ? value !== "false"
    //         : value;

    //   // also if the prop doesn't have a conflict with a complex object, just lift it to top level
    //   console.log("ACESSING", this[name], !this[name], typeof this[name]);
    //   if (typeof this[name] === "object") return;

    //   this[name] = this.extra[name];
    // });
  }

  get spells() {
    if (!this.items) {
      console.error(`Tried to access spells of character before populating items`)
      return []
    }

    return this.items.filter(item => item.type === "spell")
  }
  get ammountOfLearnedSpells() {
    return casterKnownSpellsPerLevel(this.level, this.config.isPreparedCaster) + this.config.bonusLearnedSpells
  }
  get preparedSpells() {
    return this.spells.filter(spell => spell.system.isPrepared).length
  }
  get maxPreparedSpells() {
    return this.config.isPreparedCaster
      ? preparedCasterPreparedSpells(this.ammountOfLearnedSpells)
      : this.ammountOfLearnedSpells
  }

  get defense() {
    const armorDefenseBonus = this.armor
      .filter(item => item.system.isEquiped)
      .map((item) => item.system.defense)
      .reduce((a, b) => a + b, 0)

    const defenseBonus = this.config.bonusDefense + armorDefenseBonus
    return getDefense(this.dodge, this.guard, defenseBonus)
  }
  // INFO: this introduces a bug in the config page of the sheet, where the buff stacks and multiplies on input. currently choosing not to fix it
  set defense(newDefense) {
    const newDefenseBonus = newDefense - this.defense
    this.config.bonusDefense += newDefenseBonus
    return this.defense
  }

  get guard() {
    const armorGuardBonus = this.armor
      .filter(item => item.system.isEquiped)
      .map(({system}) => system.guard)
      .reduce((a, b) => a + b, 0)

    const guardBonus = this.config.bonusGuard + armorGuardBonus
    return getGuard(this.CON, guardBonus)
  }
  set guard(newGuard) {
    const newGuardBonus = newGuard - this.guard
    this.config.bonusGuard += newGuardBonus
    return this.guard
  }

  get dodge() {
    const armorDodgeBonus = this.armor
      .filter(item => item.system.isEquiped)
      .map(({system}) => system.dodge)
      .reduce((a, b) => a + b, 0)

    const dodgeBonus = this.config.bonusDodge + armorDodgeBonus
    return getDodge(this.DEX, dodgeBonus)
  }
  set dodge(newDodge) {
    const newDodgeBonus = newDodge - this.dodge
    this.config.bonusDodge += newDodgeBonus
    return this.dodge
  }

  get miracles() {
    return (this.items ?? this.parent.items ?? [])
      .filter(item => item.type === "miracle")
  }

  populateExtraSkills() {
    console.info("TODO: implement populateExtraSkills");
  }

  getAttributeModifier(attributeNama) {
    return super.getAttributeModifier(attributeNama)
  }

  constructor(data, config) {
    super(data, config);
  }
}
