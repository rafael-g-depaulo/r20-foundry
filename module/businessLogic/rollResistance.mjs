import { getAttributeModifier } from "./attributeModifier.mjs";
import { getProficiency } from "./proficiency.mjs";

export const rollAttributeResistance = [
  "attribute",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { attributeName } = dataset;

    const roll = new Roll(`1d20 + @prof + @attb`, {
      prof: getProficiency(pc, attributeName),
      attb: getAttributeModifier(pc.attributes[attributeName]),
    });

    await roll.evaluate();

    const message = roll.toMessage({
      // content: `test message!!!!!! rolling ${attributeName} for ${this.actor.name}`,
      flavor: `${actor.name}: Rolando resistência (${attributeName})`,
      speaker: ChatMessage.getSpeaker(),
      user: actor._id,
    });

    return message;
  },
];
