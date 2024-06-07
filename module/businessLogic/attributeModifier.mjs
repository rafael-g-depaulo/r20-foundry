/**
 * @param {import('../typedefs/CharacterTypedef.mjs').Attribute} attb
 * @returns {number}
 */
export const getAttributeModifier = (attb) => Math.floor((attb.value + attb.bonus - 10) / 2)

/**
 * @param {import('../typedefs/CharacterTypedef.mjs').Attribute} attb
 * @returns {number}
 */
export const getAttributeModifierStr = (attb) => getAttributeModifier(attb) >= 0 ? `+${getAttributeModifier(attb)}` : `${getAttributeModifier(attb)}`
