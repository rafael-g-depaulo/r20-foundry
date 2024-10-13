import { getGuard, getDodge, getDefense } from "../businessLogic/defenses.mjs";
import { R20 } from "../helpers/config.mjs";
import { multiplyDice } from "../helpers/dice.mjs";
import { AttackSchema, AttributeSchema, ResourceSchema, SkillSchema } from "./fieldSchemas.mjs";

export class CharacterDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { SchemaField, ArrayField } = foundry.data.fields;

    return {
      resources: new SchemaField({
        hp: ResourceSchema(),
        mp: ResourceSchema(),
        fp: ResourceSchema(),
      }),
      attributes: new SchemaField({
        str: AttributeSchema(),
        dex: AttributeSchema(),
        con: AttributeSchema(),
        int: AttributeSchema(),
        sen: AttributeSchema(),
        pre: AttributeSchema(),
      }),
      skills: new SchemaField(
        Object.fromEntries(
          Object.entries(R20.skillAttributes).map(([skill, attribute]) => [
            skill,
            SkillSchema(attribute),
          ])
        )
      ),
      attacks: new ArrayField(AttackSchema(), {
        required: true,
        initial: [],
      })
    };
  }

  getAttributeModifier(attributeName) {
    if (!R20.attributeNamesArray.includes(attributeName))
      return 0
    const attribute = this.attributes[attributeName];
    return Math.floor((attribute.value + attribute.bonus - 10) / 2);
  }

  items = null
  get weapons() {
    if (!this.items) {
      console.error(`Tried to access weapons of character before populating items`)
      return []
    }

    return this.items.filter(item => item.type === "weapon")
  }
  get armor() {
    if (!this.items) {
      console.error(`Tried to access weapons of character before populating items`)
      return []
    }

    return this.items.filter(item => item.type === "armor")
  }

  get defense() {
    const armorDefenseBonus = this.armor
      .filter(item => item.system.isEquiped)
      .map((item) => item.system.defense)
      .reduce((a, b) => a + b, 0)

    const defenseBonus = this.config.bonusDefense + armorDefenseBonus
    return getDefense(this.dodge, this.guard, defenseBonus)
  }

  get guard() {
    const armorGuardBonus = this.armor
      .filter(item => item.system.isEquiped)
      .map(({system}) => system.guard)
      .reduce((a, b) => a + b, 0)

    const guardBonus = this.config.bonusGuard + armorGuardBonus
    return getGuard(this.CON, guardBonus)
  }

  get dodge() {
    const armorDodgeBonus = this.armor
      .filter(item => item.system.isEquiped)
      .map(({system}) => system.dodge)
      .reduce((a, b) => a + b, 0)

    const dodgeBonus = this.config.bonusDodge + armorDodgeBonus
    return getDodge(this.DEX, dodgeBonus)
  }

  populateVirtualProps() {
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

  }

  populateExternalIds({ items } = {}) {
    const itemsSource = items ?? game.items
    this.items = itemsSource
    console.log("populate external ids", this, itemsSource)

    this.attacks.forEach((attack, attackIndex) => {
      const { weaponId } = attack
      const weapon = itemsSource.find(item => item.id === weaponId)

      if (!weapon) {
        console.error(`Error trying to find weapon with id ${weaponId}. Deleting attack just to be safe.`)
        this.attacks.splice(attackIndex, 1)
        return
      }

      this.attacks[attackIndex] = { ...attack, weapon, weaponId }
    })
  }

  get STR() {
    return this.getAttributeModifier("str");
  }
  set STR(value) {
    return console.error(`R20 - Tried setting STR to ${value}`, this)
  }
  get DEX() {
    return this.getAttributeModifier("dex");
  }
  set DEX(value) {
    return console.error(`R20 - Tried setting DEX to ${value}`, this)
  }
  get CON() {
    return this.getAttributeModifier("con");
  }
  set CON(value) {
    return console.error(`R20 - Tried setting CON to ${value}`, this)
  }
  get INT() {
    return this.getAttributeModifier("int");
  }
  set INT(value) {
    return console.error(`R20 - Tried setting INT to ${value}`, this)
  }
  get SEN() {
    return this.getAttributeModifier("sen");
  }
  set SEN(value) {
    return console.error(`R20 - Tried setting SEN to ${value}`, this)
  }
  get PRE() {
    return this.getAttributeModifier("pre");
  }
  set PRE(value) {
    return console.error(`R20 - Tried setting PRE to ${value}`, this)
  }
}
