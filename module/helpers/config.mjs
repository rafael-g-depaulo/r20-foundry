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

R20.skillNames = {
  ATHLETICS: "athletics",
  ACROBATICS: "acrobatics",
  INITIATIVE: "initiative",
  STEALTH: "stealth",
  SLEIGHT_OF_HAND: "sleightOfHand",
  SURVIVAL: "survival",
  INVESTIGATION: "investigation",
  LOGIC: "logic",
  HISTORY: "history",
  MEDICINE: "medicine",
  RELIGION: "religion",
  PERCEPTION: "perception",
  EMPATHY: "empathy",
  INSIGHT: "insight",
  ARCANA: "arcana",
  NATURE: "nature",
  HANDLING: "handling",
  COOKING: "cooking",
  DECEPTION: "deception",
  INTIMIDATION: "intimidation",
  PERSUASION: "persuasion",
  PERFORMANCE: "performance",
}
R20.skillNamesArray = Object.values(R20.skillNames)

R20.skillAttributes = {
  [R20.skillNames.ATHLETICS]: R20.attributeNames.STR,
  [R20.skillNames.ACROBATICS]: R20.attributeNames.DEX,
  [R20.skillNames.INITIATIVE]: R20.attributeNames.DEX,
  [R20.skillNames.STEALTH]: R20.attributeNames.DEX,
  [R20.skillNames.SLEIGHT_OF_HAND]: R20.attributeNames.DEX,
  [R20.skillNames.SURVIVAL]: R20.attributeNames.CON,
  [R20.skillNames.INVESTIGATION]: R20.attributeNames.INT,
  [R20.skillNames.LOGIC]: R20.attributeNames.INT,
  [R20.skillNames.HISTORY]: R20.attributeNames.INT,
  [R20.skillNames.MEDICINE]: R20.attributeNames.INT,
  [R20.skillNames.RELIGION]: R20.attributeNames.INT,
  [R20.skillNames.PERCEPTION]: R20.attributeNames.SEN,
  [R20.skillNames.EMPATHY]: R20.attributeNames.SEN,
  [R20.skillNames.INSIGHT]: R20.attributeNames.SEN,
  [R20.skillNames.ARCANA]: R20.attributeNames.SEN,
  [R20.skillNames.NATURE]: R20.attributeNames.SEN,
  [R20.skillNames.HANDLING]: R20.attributeNames.PRE,
  [R20.skillNames.COOKING]: R20.attributeNames.PRE,
  [R20.skillNames.DECEPTION]: R20.attributeNames.PRE,
  [R20.skillNames.INTIMIDATION]: R20.attributeNames.PRE,
  [R20.skillNames.PERSUASION]: R20.attributeNames.PRE,
  [R20.skillNames.PERFORMANCE]: R20.attributeNames.PRE,
}

R20.ProvisionTypes = {
  STARVING: {
    cost: 0,
    bonus: -3,
    name: "Passando Fome",
  },
  RATIONING: {
    cost: 2,
    bonus: -1,
    name: "Racionando",
  },
  HUMBLE: {
    cost: 5,
    bonus: +0,
    name: "Humilde",
  },
  COMFORTABLE: {
    cost: 20,
    bonus: +1,
    name: "Confortável",
  },
  LUXURIOUS: {
    cost: 50,
    bonus: +2,
    name: "Luxuoso",
  },
  OSTENTATIOUS: {
    cost: 150,
    bonus: +3,
    name: "Ostentando",
  },
}

R20.ProvisionTypesArray = Object.keys(R20.ProvisionTypes)
R20.RestConditionsKind = {
  BAD: -1,
  NORMAL: 0,
  GOOD: 1,
  EXCEPTIONAL: 2,
}

R20.RestConditions = {
  [-1]: {
    name: "Condição Ruim",
    hpRecovery: 0,
    mpRecovery: 0.5,
  },
  [0]: {
    name: "Condição Normal",
    hpRecovery: 0.5,
    mpRecovery: 1,
  },
  [1]: {
    name: "Condição Ótima",
    hpRecovery: 1,
    mpRecovery: 2,
  },
  [2]: {
    name: "Condição Excepcional",
    hpRecovery: 2,
    mpRecovery: 3,
  },
}
