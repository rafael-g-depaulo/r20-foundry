export const numToBonus = num =>
  num > 0 ? `+${num}` :
  num < 0 ? `${num}` : ""

const bonusStringMember = /^\s*(?<sign>[-\+])?\s*(?<value>[\w\.@]+)/
export const parseBonusString = bonusStr => {
  const result = bonusStringMember.exec(bonusStr)
  if (!result) return []
  const { sign = '+', value } = result.groups
  const restBonusString = bonusStr.slice(result.index + result[0].length)
  const type = value.startsWith("@") ? "reference" : "raw"
  return [
    { sign, member: value, type },
    ...parseBonusString(restBonusString),
  ]
}
