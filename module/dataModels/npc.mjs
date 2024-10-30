import { CharacterDataModel } from "./character.mjs";
import { NpcAttackSchema } from "./fieldSchemas.mjs";

export class NpcDataModel extends CharacterDataModel {
  static defineSchema() {
    const baseCharacterSchema = CharacterDataModel.defineSchema()
    const { NumberField, StringField, ArrayField } = foundry.data.fields

    // remove attacks
    delete baseCharacterSchema.attacks

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
      attacks: new ArrayField(NpcAttackSchema(), {
        required: true,
        initial: [],
      }),
      defense: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 10,
        min: 0,
        label: "_DEFENSE",
      })
    }
  }
}
