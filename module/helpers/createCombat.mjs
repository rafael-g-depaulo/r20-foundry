import { R20Combat } from "../combat/combat.mjs"

export const createCombat = async (game, render = false) => {
  const combat = await R20Combat.create({ scene: game.scenes.current.id })
  await combat.activate({ render })
  return game.combats.active
}

export const getOrCreateCombat = async (game, render = false) => {
  return game.combats.active ?? createCombat(game, render)
}
