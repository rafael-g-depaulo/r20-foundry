import { getProficiency } from "./proficiency.mjs";

export const rollAttack = [
  "attack",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { attackId } = dataset;
    const attack = pc.attacks.find(attack => attack.id === attackId)

    // const attribute = pc.attributes[attack.system.attributeName]

    const roll = new Roll(`1d20 + @prof + @attb + @bonus`, {
      prof: attack.isProficient ? getProficiency(pc.level) : 0,
      attb: getProficiency(pc, attack.attributeName),
      bonus: attack.system.attackBonus
    });

    console.log("SDFSDFSDFFFFFFFFFFFF", attack)

    await roll.evaluate();

    const message = roll.toMessage({
      // content: `test message!!!!!! rolling ${attributeName} for ${this.actor.name}`,
      flavor: `${actor.name}: Rolando ataque (${attack.name})`,
      speaker: ChatMessage.getSpeaker(),
      user: actor._id,
    });

    return message;
  },
];
