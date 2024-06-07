

/**
 * @typedef {Object} Resource
 * @property {number} value
 * @property {number} max
 * @property {number} bonus
 */

/**
 * @typedef {Object} Resources
 * @property {Resource} hp
 * @property {Resource} mp
 */

/**
 * @typedef {Object} Attribute
 * @property {number} value
 * @property {number} bonus
 * @property {boolean} isProficient
 */

/**
 * @typedef {Object} Attributes
 * @property {Attribute} str
 * @property {Attribute} dex
 * @property {Attribute} con
 * @property {Attribute} int
 * @property {Attribute} sen
 * @property {Attribute} pre
 */

/**
 * @typedef {Object} Skill
 *
 * @property {number} proficiency
 * @property {"str" | "dex" | "con" | "int" | "sen" | "pre" } attribute
 * @property {number} bonus
 */

/**
 * @typedef {Object} Skills
 *
 * @property {Skill} athletics
 *
 * @property {Skill} acrobatics
 * @property {Skill} initiative
 * @property {Skill} stealth
 * @property {Skill} sleightOfHand
 *
 * @property {Skill} survival
 *
 * @property {Skill} investigation
 * @property {Skill} logic
 * @property {Skill} history
 * @property {Skill} medicine
 * @property {Skill} religion
 *
 * @property {Skill} perception
 * @property {Skill} empathy
 * @property {Skill} insight
 * @property {Skill} arcana
 * @property {Skill} nature
 *
 * @property {Skill} handling
 * @property {Skill} cooking
 * @property {Skill} deception
 * @property {Skill} intimidation
 * @property {Skill} persuasion
 * @property {Skill} performance
 */

/**
 * @typedef {Object} R20Character
 * @property {Attributes} attributes
 * @property {Resources} resources
 * @property {Skills} skills
 */
