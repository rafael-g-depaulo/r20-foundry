import { ItemDataModel } from "./item.mjs";

export class WeaponDataModel extends ItemDataModel {
  static defineSchema() {
    const { StringField, NumberField, ArrayField, BooleanField } = foundry.data.fields;

    const itemSchema = super.defineSchema()

    return {
      ...itemSchema,
      isEquiped: new BooleanField({
        required: true,
        nullable: false,
        initial: false,
        label: "IS_EQUIPED_",
      }),
      damage: new StringField({
        required: true,
        blank: false,
        trim: true,
        initial: "1d6",
        label: "DAMAGE_",
      }),
      critMargin: new NumberField({
        required: true,
        blank: false,
        initial: 0,
        label: "CRIT_MARGIN_",
      }),
      critMult: new NumberField({
        required: true,
        blank: false,
        initial: 2,
        label: "CRIT_MARGIN_",
      }),
      tags: new ArrayField(new StringField({
        blank: false,
        trim: true,
        label: "TAG_"
      }))
    };
  }
}
