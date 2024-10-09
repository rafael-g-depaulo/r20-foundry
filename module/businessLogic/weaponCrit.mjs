import { getWeapon } from "./weapon.mjs";

/**
 * @param {import("../typedefs/ItemTypedef.mjs").Weapon[]} weapons
 * @param {string} weaponId
 * @returns string
 */
export const getWeaponCritStr = (weapon) => {
  // const weapon = getWeapon(weapons, weaponId)

  if (!weapon?.system) return "error"
  return `(${20 - weapon.system.critMargin}/${weapon.system.critMult}x)`;
};
