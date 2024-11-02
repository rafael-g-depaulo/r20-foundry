import { AbilityDataModel } from "./ability.mjs"

export class SpellDataModel extends AbilityDataModel {
  static defineSchema() {
    const { NumberField } = foundry.data.fields

    return {
      circle: new NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0,
        label: "CIRCLE_"
      }),
      // description: new StringField({
      //   required: false,
      //   blank: true,
      //   nullable: false,
      //   initial: "description here",
      //   label: "DESCRIPTION_",
      // })
    }
  }
}
