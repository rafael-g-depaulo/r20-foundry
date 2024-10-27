import { getOrCreateActorCombatant } from "../helpers/combatant.mjs";
import { rollSkill as rollSkill_ } from "../businessLogic/skills.mjs"
import { rollRest } from "../businessLogic/rest.mjs"
import { R20 } from "../helpers/config.mjs";
import { sendMessage } from "../helpers/chat.mjs";

export const rollSkill = [
  "skill",
  async ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;
    const { skillName } = dataset;

    const roll = await rollSkill_(pc, skillName)

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

export const rollForRest = [
  "rest-roll",
  async ({ actor, dataset }) => {
    const pc = actor.system;
    const {} = dataset;

    const provisionsKind = R20.ProvisionTypesArray[3]
    const restDc = 23

    const {
      condition,
      roll,
      hpRecovered,
      mpRecovered,
    } = await rollRest({
      pc,
      provisionsKind,
      restDc,
    })

    const messageContent =
      `${actor.name} descansou. Aguentando a dificuldade ${restDc} do descanso, ${actor.name} teve um descanso "${condition.name}", com um teste de sobrevivência de ${roll.total}. ${actor.name} recupera ${hpRecovered} HP e ${mpRecovered} MP.` +
      (condition.name === R20.RestConditions[R20.RestConditionsKind.BAD].name ? ` Faça um teste de resistência de CON (CD ${restDc}). Se falhar, recebe 1 nível de exaustão, +1 para cada 5 abaixo da CD.` : "")

    const updatePromise = actor.update({
      system: {
        resources: {
          hp: { value: Math.min(pc.resources.hp.value + hpRecovered, pc.resources.hp.max) },
          mp: { value: Math.min(pc.resources.mp.value + mpRecovered, pc.resources.mp.max) },
        }
      }
    })

    const messagePromise = sendMessage({
      content: messageContent
    })

    return Promise.all([updatePromise, messagePromise])
  }
]
