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

// TODO: add show prop on extra props
// TODO: Add max resources calc
// TODO: Add maxSkill stuff
// TODO: Add defenses stuff(on char, not pc)
// TODO: Add movement stuff
// TODO: change get ATB() stuff to a getter method (on char, not pc)
export class PcDataModel extends CharacterDataModel {
  static defineSchema() {
    const baseCharacterSchema = CharacterDataModel.defineSchema();
    const { ArrayField, NumberField, SchemaField } = foundry.data.fields;

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
        isPaladin: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 0,
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
        })
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
        min: 1,
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
    console.log("ASDASDASDASDASD", this, this.items, this.spellsByCircle)

    // attack bonuses
    this.attacks.forEach((attack, attackIndex) => {
      const toHit = this.getAttributeModifier(attack.attackAttb) +
        attack.attackBonus +
        (attack.isProficient ? this.proficiency ?? 0 : 0)

      const baseDamageStr = attack.weapon.system.damage
      const bonusDamage = this.getAttributeModifier(attack.damageAttb) + attack.damageBonus
      const bonusDamageStr = bonusDamage < 0 ? bonusDamage : bonusDamage > 0 ? `+${bonusDamage}` : ""

      const damageStr = `${baseDamageStr} ${bonusDamageStr}`.trim()

      // TODO: add crit margin and crit mult options to attack
      const critBaseDamageStr = multiplyDice(attack.weapon.system.damage, attack.weapon.system.critMult)
      const critDamageStr = `${critBaseDamageStr} ${bonusDamageStr}`.trim()

      this.attacks[attackIndex].toHit = toHit
      this.attacks[attackIndex].damageStr = damageStr
      this.attacks[attackIndex].critDamageStr = critDamageStr
    })

    // update skill total bonus
    Object.entries(this.skills).forEach(([skillName, skill]) => {
      this.skills[skillName].total =
        skill.proficiency +
        skill.bonus +
        this.getAttributeModifier(skill.attribute);
    });
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

    const asdasd = this.actualItems
      .map(({ system }) => system.weight * system.quantity)
      .reduce((a, b) => a + b, 0)

    console.log("_______", asdasd)

    return asdasd
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

  populateExtraSkills() {
    console.info("TODO: implement populateExtraSkills");
  }

  constructor(data, config) {
    super(data, config);
  }
}
