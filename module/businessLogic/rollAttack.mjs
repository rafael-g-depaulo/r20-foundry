import { multiplyDice } from "../helpers/dice.mjs";
import { getProficiency } from "./proficiency.mjs";

export const rollAttack = [
  "attack",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { attackId } = dataset;
    const attack = pc.attacks[attackId]

    const roll = new Roll(`1d20 + @toHitBonus`, {
      toHitBonus: attack.toHit,
    });

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

export const rollNormalDamage = [
  "normal-damage",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { attackId } = dataset;
    const attack = pc.attacks[attackId]

    const roll = new Roll(attack.damageStr);
    await roll.evaluate();

    const message = roll.toMessage({
      // content: `test message!!!!!! rolling ${attributeName} for ${this.actor.name}`,
      flavor: `${actor.name}: Rolando dano (${attack.name})`,
      speaker: ChatMessage.getSpeaker(),
      user: actor._id,
    });

    return message;
  },
];

export const rollCriticalDamage = [
  "critical-damage",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { attackId } = dataset;
    const attack = pc.attacks[attackId]

    const roll = new Roll(attack.critDamageStr);

    await roll.evaluate();

    const message = roll.toMessage({
      // content: `test message!!!!!! rolling ${attributeName} for ${this.actor.name}`,
      flavor: `${actor.name}: Rolando dano crítico (${attack.name})`,
      speaker: ChatMessage.getSpeaker(),
      user: actor._id,
    });

    return message;
  },
];
