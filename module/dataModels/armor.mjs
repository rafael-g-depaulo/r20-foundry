import { ItemDataModel } from "./item.mjs"

// TODO: default weight
// TODO: add STR requirement field
export class ArmorDataModel extends ItemDataModel {
  static defineSchema() {
    const { NumberField, BooleanField } = foundry.data.fields
    const itemSchema = super.defineSchema()
    
    return {
      ...itemSchema,
      isEquiped: new BooleanField({
        required: true,
        nullable: false,
        initial: false,
        label: "IS_EQUIPED_",
      }),
      guard: new NumberField({
        required: true,
        integer: true,
        initial: 0,
        label: "GUARD_",
      }),
      dodge: new NumberField({
        required: true,
        integer: true,
        initial: 0,
        label: "DODGE_",
      }),
      defense: new NumberField({
        required: true,
        integer: true,
        initial: 0,
        label: "DEFENSE_",
      }),
      movementPenalty: new NumberField({
        required: true,
        integer: true,
        initial: 0,
        label: "MOVEMENT_PENALTY_",
      }),
    }
  }
}
