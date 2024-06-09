/**
 * @typedef {import('./CharacterTypedef.mjs').Resource} Resource
 */

/**
 * @typedef {Object} Resources
 * @property {Resource} hp
 * @property {Resource} mp
 * @property {Resource} fp
 */

/**
 * @typedef {Object} AbilityModifiers
 * @property {number} STR
 * @property {number} DEX
 * @property {number} CON
 * @property {number} INT
 * @property {number} SEN
 * @property {number} PRE
 */

/** @typedef {Object} CharConfig
 *
 * @property {number} lv1MaxHp
 * @property {number} hpPerLevel
 * @property {number} mpPerLevel
 *
 * @property {number} bonusMaxHP
 * @property {number} bonusMaxMP
 * @property {number} bonusMaxFP
 *
 * @property {boolean} isPaladin
 *
 * @property {number} bonusSkillPoints
 */

/**
 * @typedef {Object} _R20Pc
 * @property {number} level
 * @property {Resources} resources
 * @property {CharConfig} config
 *
 * @typedef {import('./CharacterTypedef.mjs').R20Character & _R20Pc & AbilityModifiers} R20Pc
 */
