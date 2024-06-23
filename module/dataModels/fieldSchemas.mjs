import { R20 } from "../helpers/config.mjs";

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
      coices: R20.attributeNames,
      textSearch: false,
      initial: attributeName,
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
      coices: R20.attributeNames,
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
    value: new AnyField({ initial: "" }),
    show: new BooleanField({ initial: false }),
  })
}
