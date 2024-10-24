import { NpcAttackSchema } from "../dataModels/fieldSchemas.mjs"

export const addNpcAttack = [
  "add-new-npc-attack",
  async ({ actor }) => {
    const newAttack = NpcAttackSchema().initial()
    console.log(actor, newAttack)

    console.log("Adding new attack", newAttack)
    return actor.update({
      system: {
        attacks: [...actor.system.attacks, newAttack],
      }
    })
  },
]
