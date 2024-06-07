export const increaseSkillProf = [
  "increase-skill-prof",
  ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;

    const { skill } = dataset;

    return actor.update({
      system: {
        skills: {
          [skill]: { proficiency: pc.skills[skill].proficiency + 1 },
        },
      },
    });
  },
];

export const decreaseSkillProf = [
  "decrease-skill-prof",
  ({ actor, dataset }) => {
    /** @type import("../typedefs/PcTypedef.mjs").R20Pc */
    const pc = actor.system;

    const { skill } = dataset;

    return actor.update({
      system: {
        skills: {
          [skill]: { proficiency: pc.skills[skill].proficiency - 1 },
        },
      },
    });
  },
]
