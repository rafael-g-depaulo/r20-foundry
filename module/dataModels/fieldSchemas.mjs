import { R20 } from "../helpers/config.mjs";
import { WeaponDataModel } from "./weapon.mjs";
import { R20Item } from "../documents/item.mjs"

export const ResourceSchema = () => {
  const { NumberField, SchemaField } = foundry.data.fields;

  return new SchemaField({
    value: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      initial: 1,
    }),
    max: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      min: 1,
      initial: 1,
    }),
    bonus: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      min: 0,
      initial: 0,
    }),
  });
};

export const AttributeSchema = () => {
  const { NumberField, SchemaField } = foundry.data.fields;

  return new SchemaField({
    value: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      min: 0,
      initial: 10,
    }),
    bonus: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      min: 0,
      initial: 0,
    }),
  });
};

export const SkillSchema = (attributeName) => {
  const { NumberField, StringField, SchemaField } = foundry.data.fields;

  return new SchemaField({
    proficiency: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      min: 0,
      initial: 0,
    }),
    bonus: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      initial: 0,
    }),
    attribute: new StringField({
      required: true,
      nullable: false,
      choices: R20.attributeNamesArray,
      textSearch: false,
      initial: attributeName,
    }),
    total: new NumberField({
      required: false,
      nullable: false,
      integer: true,
      initial: 0,
    }),
  });
};

export const ExtraSkillSchema = () => {
  const { NumberField, StringField, SchemaField } = foundry.data.fields;

  return new SchemaField({
    name: new StringField({
      required: true,
      trim: true,
      nullable: false,
    }),
    proficiency: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      min: 0,
      initial: 0,
    }),
    bonus: new NumberField({
      required: true,
      integer: true,
      nullable: false,
      initial: 0,
    }),
    attribute: new StringField({
      required: true,
      nullable: false,
      choices: R20.attributeNamesArray,
      textSearch: false,
      initial: R20.attributeNames.INT,
    }),
  });
}

export const ExtraPropertySchema = () => {
  const { StringField, SchemaField, AnyField, BooleanField } = foundry.data.fields;

  return new SchemaField({
    name: new StringField({
      required: true,
      trim: true,
      nullable: false,
    }),
    type: new StringField({
      required: true,
      nullable: false,
      choises: ["bool", "number", "text"],
      initial: "number",
      textSearch: false,
    }),
    value: new StringField({ initial: "" }),
    show: new BooleanField({ initial: false }),
  })
}

export const NpcAttackSchema = () => {
  const { SchemaField, NumberField, StringField, DocumentIdField } = foundry.data.fields

  return new SchemaField({
    name: new StringField({
      required: true,
      trim: true,
      nullable: false,
      initial: "attack name here",
    }),
    toHit: new NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0,
      label: "TO_HIT_"
    }),
    damageStr: new StringField({
      required: true,
      nullable: false,
      trim: true,
      initial: "1d6+2",
      label: "DAMAGE_",
    }),
    state: new StringField({
      required: true,
      nullable: false,
      blank: false,
      choices: ["view", "edit", "delete"],
      initial: "view"
    }),
  })
}
export const AttackSchema = () => {
  const { SchemaField, BooleanField, StringField, DocumentIdField } = foundry.data.fields

  return new SchemaField({
    name: new StringField({
      required: true,
      trim: true,
      nullable: false,
      initial: "attack",
    }),
    attackBonus: new StringField({
      required: true,
      nullable: false,
      blank: true,
      initial: "",
    }),
    damageBonus: new StringField({
      required: true,
      nullable: false,
      blank: true,
      initial: "",
    }),
    attackAttb: new StringField({
      required: true,
      nullable: false,
      blank: true,
      choices: ["", ...R20.attributeNamesArray],
      initial: "",
    }),
    damageAttb: new StringField({
      required: true,
      nullable: false,
      blank: true,
      choices: ["", ...R20.attributeNamesArray],
      initial: "",
    }),
    // weapon: new EmbeddedDocumentField(R20Item, { required: false })
    weaponId: new DocumentIdField({
      required: false,
      nullable: true,
    }),
    state: new StringField({
      required: true,
      nullable: false,
      blank: false,
      choices: ["view", "edit", "delete"],
      initial: "view"
    }),
    isProficient: new BooleanField({
      required: true,
      nullable: false,
      initial: true,
      label: "_IS_PROFICIENT"
    }),
  })
}
