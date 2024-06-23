import { CharacterDataModel } from "./character.mjs";
import { ExtraPropertySchema, ExtraSkillSchema } from "./fieldSchemas.mjs";

// TODO: add show prop on extra props
// TODO: Add max resources calc
// TODO: Add maxSkill stuff
// TODO: Add defenses stuff(on char, not pc)
// TODO: Add movement stuff
// TODO: change get ATB() stuff to a getter method (on char, not pc)
export class PcDataModel extends CharacterDataModel {
  static defineSchema() {
    const baseCharacterSchema = CharacterDataModel.defineSchema();
    const { ArrayField, NumberField, SchemaField } = foundry.data.fields;

    return {
      ...baseCharacterSchema,
      level: new NumberField({
        required: true,
        nullable: false,
        integer: true,
        min: 1,
        max: 20,
        initial: 1,
      }),
      extraSkills: new ArrayField(ExtraSkillSchema()),
      extraProperties: new ArrayField(ExtraPropertySchema()),
      config: new SchemaField({
        lv1MaxHp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 1,
          initial: 10,
        }),
        hpPerLevel: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 4,
        }),

        mpPerLevel: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 3,
        }),
        bonusMaxHp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusMaxMp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusMaxFp: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        isPaladin: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          min: 0,
          initial: 0,
        }),
        bonusSkillPoints: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusCapacity: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusDefense: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusGuard: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        bonusDodge: new NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
      }),
    };
  }

  // // leftover from when i was trying to implement stuff using proxy. it works, but i prefer a more low-tech solution
  // #_extraProps = { __system__: this }
  // extra = new Proxy(this.#_extraProps, {
  //   get(obj, key) {
  //     const { __system__: system } = obj
  //     const extraProps = system.extraProperties
  //     const extraProp = extraProps.find(prop => prop.name === key)
  //
  //     if (!extraProp) {
  //       console.error(`Tried to get extra property ${key} but couldn't. obj:`, obj)
  //       return undefined
  //     }
  //
  //     if (extraProp.type === "number") return Number(extraProp.value)
  //     if (extraProp.type === "bool") return extraProp.value !== "false"
  //     return extraProp.value
  //   },
  //   set(obj, prop, value) {
  //     console.error(`Can't set extra prop of caracter through this proxy`, obj, prop, value)
  //   },
  // })

  extra = {}
  constructor(data, config) {
    super(data, config)

    // populate the extra props
    data.extraProperties.forEach(({ name, type, value }) => {
      this.extra[name] = type === "number" ? Number(value) : type === "bool" ? value !== "false" : value

      // also if the prop doesn't have a conflict with a complex object, just lift it to top level
      console.log(
        "ACESSING", this[name], !this[name], typeof this[name]
      )
      if (typeof this[name] === "object") return

      this[name] = this.extra[name]
    })
  }
}
