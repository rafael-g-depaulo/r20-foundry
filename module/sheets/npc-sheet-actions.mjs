import { NpcAttackSchema } from "../dataModels/fieldSchemas.mjs"

export const addNpcAttack = [
  "add-new-npc-attack",
  async ({ actor }) => {
    const newAttack = NpcAttackSchema().initial()

    return actor.update({
      system: {
        attacks: [...actor.system.attacks, newAttack],
      }
    })
  },
]
