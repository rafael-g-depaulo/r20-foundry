import { AttackSchema } from "../dataModels/fieldSchemas.mjs";

export const makeNewAttack = ({ weaponId }) => ({
  ...AttackSchema().initial(),
  weaponId,
})
