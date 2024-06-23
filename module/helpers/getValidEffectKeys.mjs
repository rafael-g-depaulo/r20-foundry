const filterList = [
  // general groups
  /description/,
  /folder/,
  /sort/,
  /_id/,
  /name/,
  /flags/,

  // "ignore if has path segments that _____"
  /\._/, //start with "_"

  // complex rules
  /^resources\..*\.max/, // no updating resource maxes (has config value for it)

  // virtual/calculated values
  /^guard/,
  /^dodge/,
  /^gear/,
  /^level/,
  /^defense/,
  /^items/,
  /^armor/,
  /^weapons/,
  /^maxItemCapacity/,
  /^maxSkillProficiency/,
  /^openSkillPoints/,
  /^totalSkillPoints/,
  /^STR/,
  /^DEX/,
  /^CON/,
  /^INT/,
  /^SEN/,
  /^PRE/,
];

const getAttributes = (pcObj, prefix = "") =>
  Array.isArray(pcObj)
    ? pcObj.flatMap((value, index) =>
      typeof value !== "object"
        ? pathStr(prefix, index)
        : getAttributes(value, `${prefix}[${index}]`)
    )
    : Object.entries(pcObj).flatMap(([key, value]) =>
      !value
        ? pathStr(prefix, key)
        : typeof value === "object"
          ? getAttributes(value, pathStr(prefix, key))
          : pathStr(prefix, key)
    );

export const getValidEffectKeys = (pcObj) =>
  getAttributes(pcObj).filter(
    (pathStr) => !filterList.some((reg) => reg.test(pathStr))
  );
