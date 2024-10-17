import { CharacterDataModel } from "./character.mjs";

export class NpcDataModel extends CharacterDataModel {
  static defineSchema() {
    const baseCharacterSchema = CharacterDataModel.defineSchema()
    const { NumberField, StringField } = foundry.data.fields

    return {
      ...baseCharacterSchema,
      cr: new NumberField({
        required: true,
        nullable: false,
        integer: false,
        initial: 1,
        min: 0,
        label: "_CR",
      }),
      movement: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 6,
        min: 0,
        label: "_Movement",
      }),
      description: new StringField({
        required: true,
        nullable: false,
        initial: "description",
        label: "DESCRIOTION_",
      }),
    }
  }
}
