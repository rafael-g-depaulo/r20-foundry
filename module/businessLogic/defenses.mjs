
export const getDefense = (dodge, guard, defBonus) => 10 + Math.max(dodge, guard) + defBonus

export const getDodge = (DEX, dodgeBonus) => DEX + dodgeBonus

export const getGuard = (CON, guardBonus) => CON + guardBonus

