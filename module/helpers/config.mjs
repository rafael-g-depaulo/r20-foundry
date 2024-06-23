export const R20 = {};

// /**
//  * The set of Ability Scores used within the system.
//  * @type {Object}
//  */
// R20.abilities = {
//   str: "R20.Ability.Str.long",
//   dex: "R20.Ability.Dex.long",
//   con: "R20.Ability.Con.long",
//   int: "R20.Ability.Int.long",
//   wis: "R20.Ability.Wis.long",
//   cha: "R20.Ability.Cha.long",
// };
//
// R20.abilityAbbreviations = {
//   str: "R20.Ability.Str.abbr",
//   dex: "R20.Ability.Dex.abbr",
//   con: "R20.Ability.Con.abbr",
//   int: "R20.Ability.Int.abbr",
//   wis: "R20.Ability.Wis.abbr",
//   cha: "R20.Ability.Cha.abbr",
// };

R20.attributeNamesArray = ["str", "dex", "con", "int", "sen", "pre"];
R20.attributeNames = {
  STR: R20.attributeNamesArray[0],
  DEX: R20.attributeNamesArray[1],
  CON: R20.attributeNamesArray[2],
  INT: R20.attributeNamesArray[3],
  SEN: R20.attributeNamesArray[4],
  PRE: R20.attributeNamesArray[5],
}

R20.skillAttributes = {
  athletics: "str",
  acrobatics: "dex",
  initiative: "dex",
  stealth: "dex",
  sleightOfHand: "dex",
  survival: "con",
  investigation: "int",
  logic: "int",
  history: "int",
  medicine: "int",
  religion: "int",
  perception: "sen",
  empathy: "sen",
  insight: "sen",
  arcana: "sen",
  nature: "sen",
  handling: "pre",
  cooking: "pre",
  deception: "pre",
  intimidation: "pre",
  persuasion: "pre",
  performance: "pre",
}
