export const getEquipGuardBonus = (gear) => 0
export const getGuard = (pc) => pc.CON + getEquipGuardBonus(pc.gear) + pc.config.bonusGuard

export const getEquipDodgeBonus = (gear) => 0
export const getDodge = (pc) => pc.DEX + getEquipDodgeBonus(pc.gear) + pc.config.bonusDodge

export const getDefense = (pc) => 10 + Math.max(getGuard(pc), getDodge(pc)) + pc.config.bonusDefense
