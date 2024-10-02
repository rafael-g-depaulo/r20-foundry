import { AttackSchema } from "../dataModels/fieldSchemas.mjs";

export const makeNewAttack = ({ weapon }) => ({
  ...AttackSchema().initial(),
  weapon,
})
