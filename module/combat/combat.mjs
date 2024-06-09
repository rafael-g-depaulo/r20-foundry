
export class R20Combat extends Combat {

  // _sortCombatants(a, b) {
  // }

  prepareCombatant(...args) {
    return super.prepareCombatant(...args)
  }

  _prepareCombatant(c, scene, players, settings = {}) {
    const combatant = super._prepareCombatant(c, scene, players, settings)
    console.log("COMBATANTE@!@@@@@@@!@")
    return combatant
  }

  async rollInitiative(ids, formulaopts, updateTurnopt, messageOptionsopt) {
    const asdasd = await super.rollInitiative(ids, formulaopts, updateTurnopt, messageOptionsopt)

    console.log("rolling initiative")

    return asdasd
  }

  async createEmbededDocuments(embeddedName, data = [], context = {}) {
    return super.createEmbeddedDocuments(embeddedName, data, context)
  }
}
