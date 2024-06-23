import { R20 } from "../helpers/config.mjs";
import { AttributeSchema, ResourceSchema, SkillSchema } from "./fieldSchemas.mjs";

export class CharacterDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { SchemaField } = foundry.data.fields;

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
    };
  }

  getAttributeModifier(attributeName) {
    const attribute = this.attributes[attributeName];
    return Math.floor((attribute.value + attribute.bonus - 10) / 2);
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
