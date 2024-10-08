import { R20 } from "../helpers/config.mjs";
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

  populateExternalIds({ items } = {}) {
    const itemsSource = items ?? game.items
    this.items = itemsSource
    console.log("populate external ids", this, itemsSource)

    this.attacks.forEach((attack, attackIndex) => {
      const { weaponId } = attack
      const weapon = itemsSource.find(item => item.id === weaponId)

      if (!weapon) {
        console.error(`Error trying to find weapon with id ${weaponId}.`, { chaeacter: this, attack, items })
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
