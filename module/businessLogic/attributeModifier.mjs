/**
 * @param {import('../typedefs/CharacterTypedef.mjs').Attribute} attb
 * @returns {number}
 */
export const getAttributeModifier = (attb, isProficient = false, proficiencyBonus = 0) => Math.floor((attb.value + attb.bonus - 10) / 2) + (isProficient ? proficiencyBonus : 0)

/**
 * @param {import('../typedefs/CharacterTypedef.mjs').Attribute} attb
 * @returns {number}
 */
export const getAttributeModifierStr = (attb, isProficient = false, proficiencyBonus = 0) => getAttributeModifier(attb, isProficient, proficiencyBonus) >= 0 ? `+${getAttributeModifier(attb, isProficient, proficiencyBonus)}` : `${getAttributeModifier(attb, isProficient, proficiencyBonus)}`
