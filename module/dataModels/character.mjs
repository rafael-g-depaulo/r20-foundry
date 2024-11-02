import { getGuard, getDodge, getDefense } from "../businessLogic/defenses.mjs";
import { R20 } from "../helpers/config.mjs";
import { multiplyDice } from "../helpers/dice.mjs";
import { AttackSchema, AttributeSchema, ResourceSchema, SkillSchema } from "./fieldSchemas.mjs";

export class CharacterDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { SchemaField, ArrayField, StringField } = foundry.data.fields;

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
      }),
      // for dynamic bonuses to stuff
      bonus: new SchemaField({
        attack: new SchemaField({
          toHit: new StringField({
            required: true,
            nullable: false,
            initial: "",
          }),
          damage: new StringField({
            required: true,
            nullable: false,
            initial: "",
          }),
        })
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
      console.error(`Tried to access armor of character before populating items`)
      return []
    }

    return this.items.filter(item => item.type === "armor")
  }
  get actualItems() {
    if (!this.items) {
      console.error(`Tried to access items of character before populating items`)
      return []
    }

    return this.items.filter(item => item.type === "weapon" || item.type === "armor" || item.type === "item")
  }

  get abilities() {
    if (!this.items) {
      console.error(`Tried to access abilities of character before populating items`)
      return []
    }

    return this.items.filter(item => item.type === "ability")
  }

  populateVirtualProps() {}

  populateExternalIds({ items } = {}) {
    const itemsSource = items ?? game.items
    this.items = itemsSource
    // console.log("populate external ids", this, itemsSource)
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
