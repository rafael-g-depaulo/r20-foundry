import { AbilityDataModel } from "./ability.mjs"

export class SpellDataModel extends AbilityDataModel {
  static defineSchema() {
    const { NumberField, BooleanField } = foundry.data.fields

    return {
      circle: new NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0,
        label: "CIRCLE_"
      }),
      isPrepared: new BooleanField({
        required: true,
        nullable: false,
        initial: true,
        label: "IS_PREPARED_",
      }),
    }
  }
}
