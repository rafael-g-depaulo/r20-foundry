export const getAttackCritStr = (attack) => {
  // const weapon = getWeapon(weapons, weaponId)
  return `(${20 - attack.critMarginTotal}/${attack.critMultTotal}x)`;
};
