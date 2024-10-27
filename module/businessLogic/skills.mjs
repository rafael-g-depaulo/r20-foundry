import { getAttributeModifier } from "./attributeModifier.mjs";

export const maxSkillProficiency = (level) =>
  level === 1
    ? 2
    : level === 2
      ? 3
      : level === 3
        ? 3
        : level === 4
          ? 4
          : level === 5
            ? 5
            : level === 6
              ? 5
              : level === 7
                ? 7
                : level === 8
                  ? 7
                  : level === 9
                    ? 7
                    : level === 10
                      ? 9
                      : level === 11
                        ? 9
                        : level === 12
                          ? 9
                          : level === 13
                            ? 12
                            : level === 14
                              ? 12
                              : level === 15
                                ? 12
                                : 15;

/**
 * @param {import("../typedefs/PcTypedef.mjs").R20Pc} pc
 */
export const totalSkillPoints = (pc) =>
  5 +
  getAttributeModifier(pc.attributes.int) +
  Math.floor(pc.level / 2) * 2 +
  (Math.ceil(pc.level / 2) - 1) * (2 + getAttributeModifier(pc.attributes.int));

/**
 * @param {import("../typedefs/PcTypedef.mjs").R20Pc} pc
 */
export const leftOverSkillPoints = (pc) =>
  totalSkillPoints(pc) -
  Object.values(pc.skills)
    .map((skill) => skill.proficiency)
    .reduce((acc, cur) => acc + cur);

export const rollSkill = async (pc, skillName, bonus = 0) => {
  const skill = pc.skills[skillName];
  const skillAttribute = pc.attributes[skill.attribute];

  const roll = new Roll(`1d20 + @prof + @attb + @bonus`, {
    prof: skill.proficiency,
    attb: getAttributeModifier(skillAttribute),
    bonus: skill.bonus + bonus,
  });

  await roll.evaluate();

  return roll
}
