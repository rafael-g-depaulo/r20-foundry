import { R20Combat } from "../combat/combat.mjs";
import { R20Combatant } from "../combat/combatant.mjs";
import { R20Actor } from "../documents/actor.mjs";

/**
 * @param {R20Actor} actor
 * @param {R20Combat} combat
 * @returns {R20Combatant | undefined}
 */
export const getActorCombatant = (combat = game.combats.active, actor) => {
  return combat.combatants.find(({ actorId }) => actorId === actor.id);
};

export const getOrCreateActorCombatant = async (
  actor,
  combat = game.combats.active
) => {
  const existingActor = getActorCombatant(combat, actor);
  if (existingActor) return existingActor;

  await Promise.resolve();

  await combat.createEmbededDocuments("Combatant", [
    {
      actorId: actor.id,
      name: actor.name,
      img: actor.img,
    },
  ]);

  return getActorCombatant(combat, actor);
};
