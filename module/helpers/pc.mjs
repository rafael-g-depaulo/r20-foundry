import { look } from "./effects.mjs"

const getPcPath = (pc, path) => {
  try {
    return look(pc, path.slice(1))
  } catch (e) {
    console.error(`Error while parsing BonusArray system reference in effect. Error`, e)
    return null
  }
}
export const populateBonusArray = (arr, pc) => arr
  .map(({ member, type, sign }) => 
    type !== 'reference'
      ? { member, sign }
      : { 
        member: getPcPath(pc, member),
        sign,
      }
  )
  .reduce((acc, { sign, member }) => `${acc} ${sign === '-' ? "" : sign}${member}`, "")


