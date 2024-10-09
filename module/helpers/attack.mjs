
export const setAttackState = (actor, attackId, newState) => {
  const attacksArr = actor.system.attacks
  attacksArr[attackId].state = newState

  console.log("!@!!!!!", attacksArr, actor)
  actor.update({
    system: {
      attacks: attacksArr,
    }
  })

}

export const deleteAttack = (actor, attackId) => {
  // remove attack
  actor.system.attacks.splice(attackId, 1)

  actor.update({
    system: {
      attacks: actor.system.attacks,
    }
  })
}
