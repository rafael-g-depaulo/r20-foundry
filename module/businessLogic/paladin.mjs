import { getProficiency } from "./proficiency.mjs";

export const knownMiraclesPerLevel = (level) => 1 + getProficiency(level)
