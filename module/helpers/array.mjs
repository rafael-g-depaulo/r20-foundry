export const recursiveFixArraysInplace = obj => {
  let makeArray = false
  for (const key in obj) {
    if (Number.isInteger(Number(key))) {
      makeArray = true
    }
    if (typeof obj[key] === 'object') {
      obj[key] = recursiveFixArraysInplace(obj[key])
    }
  }
  if (makeArray && !Array.isArray(obj)) {
    const newArray = []
    for (const key in obj)
      newArray[Number(key)] = obj[key]
    return newArray
  }
  return obj
}

export const groupBy = (test, items) => items.reduce((acc, cur) => ({ ...acc, [test(cur)]: [...(acc[test(cur)] ?? []), cur] }), {})

