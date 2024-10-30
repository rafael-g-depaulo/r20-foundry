// TODO add hidden items (use for unarmed attack)
export class ItemDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { NumberField, StringField } = foundry.data.fields
    
    return {
      weight: new NumberField({
        required: true,
        integer: false,
        initial: 1,
        label: "WEIGHT_"
      }),
      quantity: new NumberField({
        required: true,
        integer: true,
        initial: 1,
        label: "QUANTITY_",
      }),
      description: new StringField({
        required: false,
        blank: true,
        nullable: false,
        initial: "",
        label: "DESCRIPTION_",
      }),
    }
  }
}
