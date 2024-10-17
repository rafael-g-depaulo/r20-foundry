export class SpellDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { NumberField, StringField } = foundry.data.fields

    return {
      circle: new NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0,
        label: "CIRCLE_"
      }),
      description: new StringField({
        required: false,
        blank: true,
        nullable: false,
        initial: "description here",
        label: "DESCRIPTION_",
      })
    }
  }
}
