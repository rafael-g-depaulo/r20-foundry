import { R20 } from "../helpers/config.mjs"
import { minMax } from "./movement.mjs"
import { rollSkill } from "./skills.mjs"

export const rollRest = async ({
  pc,
  provisionsKind,
  restDc,
  skillName = R20.skillNames.SURVIVAL
}) => {
  const provision = R20.ProvisionTypes[provisionsKind]

  if (!provisionsKind) {
    console.error(`invalid type of provisions "${provisionsKind}"`)
    return
  }

  const roll = await rollSkill(pc, skillName, provision.bonus)
  
  const conditionId = minMax(
    -1,
    Math.floor((roll.total - restDc) / 5),
    2
  )
  const condition = R20.RestConditions[conditionId]
  
  return {
    roll,
    condition: condition,
    hpRecovered: Math.ceil(pc.level * condition.hpRecovery),
    mpRecovered: Math.ceil(pc.level * condition.mpRecovery),
  }
  
}
