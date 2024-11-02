export class AbilityDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const { StringField } = foundry.data.fields
    
    return {
      description: new StringField({
        required: true,
        blank: false,
        nullable: false,
        initial: "descrição aqui",
        label: "DESCRIPTION_"
      })
    }
  }
}
