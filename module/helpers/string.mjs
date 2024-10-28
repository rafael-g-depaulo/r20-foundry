export const numToBonus = num =>
  num > 0 ? `+${num}` :
  num < 0 ? `${num}` : ""
