
/**
 * @param {import("../typedefs/ItemTypedef.mjs").Weapon[]} weapons
 * @param {string} weaponId
 * @returns import("../typedefs/ItemTypedef.mjs").Weapon
 */
export const getWeapon = (weapons = [], weaponId) => weapons.find((w) => w._id === weaponId);

export const getItemCategory = (items = [], category) => items.filter(item => item.type === category)
