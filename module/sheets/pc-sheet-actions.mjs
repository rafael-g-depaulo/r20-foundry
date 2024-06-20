import { makeNewAttack } from "../businessLogic/attack.mjs";
import { newExtraProperty } from "../businessLogic/extraProperty.mjs";
import { editItem, setItemFlag } from "../helpers/item.mjs";

export const increaseSkillProf = [
  "increase-skill-prof",
  ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;

    const { skill } = dataset;

    return actor.update({
      system: {
        skills: {
          [skill]: { proficiency: pc.skills[skill].proficiency + 1 },
        },
      },
    });
  },
];

export const decreaseSkillProf = [
  "decrease-skill-prof",
  ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;

    const { skill } = dataset;

    return actor.update({
      system: {
        skills: {
          [skill]: { proficiency: pc.skills[skill].proficiency - 1 },
        },
      },
    });
  },
];

export const toggleItemEquip = [
  "toggle-item-equip",
  async ({ actor, dataset }) => {
    console.log("toggling", actor, dataset);
    const { itemId, previousState } = dataset;
    // await actor.updateEmbeddedDocuments("Item", [
    //   { _id: itemId, system: { isEquiped: previousState === "false" } },
    // ]);

    editItem(actor, itemId, {
      system: {
        isEquiped: previousState === "false",
      },
    });
  },
];

export const addNewAttack = [
  "add-new-attack",
  async ({ actor }) => {
    console.log("adding a new attack for actor");
    return actor.createEmbeddedDocuments("Item", [makeNewAttack()]);
  },
];

export const editAttack = [
  "edit-attack",
  async ({ dataset, actor }) => {
    const { attackId } = dataset;
    setItemFlag(actor, attackId, "state", "editing");
  },
];

export const removeAttack = [
  "remove-attack",
  async ({ dataset, actor }) => {
    const { attackId } = dataset;
    setItemFlag(actor, attackId, "state", "deleting");
  },
];

export const setViewAttack = [
  "view-attack",
  async ({ dataset, actor }) => {
    const { attackId } = dataset;
    setItemFlag(actor, attackId, "state", "view");
  },
];

export const removeAttackConfim = [
  "remove-attack-confirm",
  async ({ actor, dataset }) => {
    const { attackId } = dataset;
    return actor.deleteEmbeddedDocuments("Item", [attackId]);
  },
];

export const addExtraProperty = [
  "add-extra-property",
  async ({ actor }) => {
    return actor.update({
      system: {
        config: {
          _extraProps: [
            ...(actor.system.config._extraProps ?? []),
            newExtraProperty(),
          ],
        },
      },
    });
  },
];
export const removeExtraProperty = [
  "remove-extra-property",
  async ({ actor, dataset }) => {
    const { propIndex } = dataset
    console.log(actor.system.config._extraProps, propIndex)
    // remove destructively from current array and return it
    actor.system.config._extraProps.splice(propIndex, 1)
    console.log(actor.system.config._extraProps, propIndex)

    return actor.update({
      system: {
        config: {
          _extraProps: actor.system.config._extraProps
        }
      }
    })
  }
]
