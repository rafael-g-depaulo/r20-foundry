/**
 * @param {import('../typedefs/PcTypedef.mjs').R20Pc} pc
 * @param {"str" | "dex" | "con" | "int" | "sen" | "pre"} attbName
 * @returns {number}
 */
export const getProficiencyBonus = (pc, attbName) => pc.attributes[attbName].isProficient ? pc.level + 4 : 0
