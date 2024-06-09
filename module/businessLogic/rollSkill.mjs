import { getActorCombatant, getOrCreateActorCombatant } from "../helpers/combatant.mjs";
import { getOrCreateCombat } from "../helpers/createCombat.mjs";
import { getAttributeModifier } from "./attributeModifier.mjs";

export const rollSkill = [
  "skill",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { skillName } = dataset;

    /** @type import("../typedefs/CharacterTypedef.mjs").Skill */
    const skill = pc.skills[skillName];
    /** @type import("../typedefs/CharacterTypedef.mjs").Attribute */
    const skillAttribute = pc.attributes[skill.attribute];

    const roll = new Roll(`1d20 + @prof + @attb + @bonus`, {
      prof: skill.proficiency,
      attb: getAttributeModifier(skillAttribute),
      bonus: skill.bonus,
    });

    await roll.evaluate();

    const message = roll.toMessage({
      flavor: `${actor.name}: Rolando ${skillName}`,
      speaker: ChatMessage.getSpeaker(),
      user: actor._id,
    });

    if (skillName === "initiative") {
      const combatant = await getOrCreateActorCombatant(actor)
      combatant.update({ initiative: roll.total });
    }

    return message;
  },
];
