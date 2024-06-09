import { getAttributeModifier } from "./attributeModifier.mjs";

export const rollSkill = [
  "skill",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { skillName } = dataset;

    /** @type import("../typedefs/CharacterTypedef.mjs").Skill */
    const skill = pc.skills[skillName]
    /** @type import("../typedefs/CharacterTypedef.mjs").Attribute */
    const skillAttribute = pc.attributes[skill.attribute]
    console.log({ dataset }, "hiiiii", skill)
    console.log(actor)

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

    if (skillName === 'initiative') {

      console.log(actor, "INIT!!!")
      const combatTracker = new CombatTracker()
      const activeCombat = combatTracker.combats[0] // Deal with no active combat case
      const combatant = activeCombat.combatants.find(({ actorId }) => actorId === actor.id)

      // TODO: find how to add a new combatant to a combat. with this the edge case of rolling initiative to add a new combatant to combat is done. probably should throw most of this logic into R20CombatTracker and/or R20Combat and/or R20Combatant

      combatant.update({ initiative: 999 })
    }

    return message;
  }
]
