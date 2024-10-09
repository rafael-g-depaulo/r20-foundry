/**
 * @param {import('../typedefs/PcTypedef.mjs').R20Pc} pc
 * @param {"str" | "dex" | "con" | "int" | "sen" | "pre"} attbName
 * @returns {number}
 */
export const getAttributeProficiency = (pc, attbName) =>
  !attbName
    ? 0
    : !pc.attributes[attbName].isProficient
      ? 0
      : getProficiency(pc.system.level);

export const getProficiency = (level) => {
  return Math.ceil(level / 2)
}
