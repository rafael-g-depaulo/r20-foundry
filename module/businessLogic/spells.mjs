const fullCasterKnownSpellsPerLevel = (level) => level + 2

const offCasterKnownSpellsPerLevel = level => 1 + Math.floor(level)

export const casterKnownSpellsPerLevel = (level, isFullCaster) => isFullCaster
  ? fullCasterKnownSpellsPerLevel(level)
  : offCasterKnownSpellsPerLevel(level)

export const preparedCasterPreparedSpells = knownSpellsAmmount => Math.ceil(knownSpellsAmmount / 2)
