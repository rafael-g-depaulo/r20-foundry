import { multiplyDice } from "../helpers/dice.mjs";
import { getProficiency } from "./proficiency.mjs";

export const rollAttack = [
  "attack",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { attackId } = dataset;
    const attack = pc.attacks.find((attack) => attack.id === attackId);

    console.log("!!!!!!!!!!!!", pc, attack);
    // const attribute = pc.attributes[attack.system.attributeName]
    const prof = attack.isProficient ? getProficiency(pc.level) : 0;
    const attb = pc[(attack.system.attribute ?? "").toUpperCase()] ?? 0;
    const bonus =
      attack.system.attackBonus !== "" ? attack.system.attackBonus : 0;

    console.log(prof, attb, bonus);

    const roll = new Roll(`1d20 + @prof + @attb + @bonus`, {
      prof,
      attb,
      bonus,
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
    const attack = pc.attacks.find((attack) => attack.id === attackId);

    const attackAttb = !attack.system.attribute
      ? ""
      : ` + ${pc[attack.system.attribute.toUpperCase()]}`;
    const damageBonus =
      attack.system.damageBonus === "" ? "" : ` + ${attack.system.damageBonus}`;
    const rollStr =
      `${attack.system.weapon.system.damage}` + damageBonus + attackAttb;

    const roll = new Roll(rollStr);

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
    const attack = pc.attacks.find((attack) => attack.id === attackId);

    const attackAttb = !attack.system.attribute
      ? ""
      : ` + ${pc[attack.system.attribute.toUpperCase()]}`;

    const damageBonus =
      attack.system.damageBonus === "" ? "" : ` + ${attack.system.damageBonus}`;

    const baseDamage = multiplyDice(
      attack.system.weapon.system.damage,
      attack.system.weapon.system.critMult
    );

    const rollStr = baseDamage + damageBonus + attackAttb;

    const roll = new Roll(rollStr);

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
