
const minMax = (min, value, max) => Math.min(Math.max(min, value), max)

const encumberedSpeed = (speed, isEncumbered) => isEncumbered ? Math.max(1, Math.floor(speed/2)) : speed

export const getPcMovementSpeed = (STR, bonusSpeed, isEncumbered) => encumberedSpeed(minMax(4, 5+STR, 8) + bonusSpeed, isEncumbered)
