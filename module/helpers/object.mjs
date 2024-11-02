import { look } from "./effects.mjs";

const startsWithArrayItem = /^\[(\d+)\](.*)/;
const startsWithProp = /^\.([^\.\[]+)(.*)/;

export const getPath = (path) => {
  if (path === "") return []

  if (startsWithArrayItem.test(path)) {
    const [, indexStr, rest] = startsWithArrayItem.exec(path);
    return [Number(indexStr), ...getPath(rest)]

    // if (rest === "") {
    //   obj[Number(indexStr)] = value;
    //   return;
    // }

    // return getPath(obj[Number(indexStr)], rest, value);
  }

  if (startsWithProp.test(path)) {
    const [, key, rest] = startsWithProp.exec(path);
    return [key, ...getPath(rest)]

    // if (rest === "") {
    //   obj[key] = value;
    //   return;
    // }

    // return getPath(obj[key], rest, value);
  }

  console.error("get path errored when trying to read path", path)
};


export const makeEntry = (path, value) => {
  const key = path[0]
  if (!key) return value

  const restPath = path.slice(1)
  if (typeof key === "number") {
    let arr = []
    arr[key] = makeEntry(restPath, value)
    return arr
  }

  return {
    [key]: makeEntry(restPath, value)
  }
}

export const getType = (a) => Array.isArray(a) ? "array" : typeof a

export const deepClone = a =>
  getType(a) === "array" ?
    a.map(aItem => deepClone(aItem))
    : typeof a === 'object' ?
      Object.fromEntries(Object.entries(a).map(([key, value]) => [key, deepClone(value)]))
      : a

export const deepJoinTwo = (a, b) => {
  // if different types, replace
  if (getType(a) !== getType(b)) return b;

  // if not complex type, replace
  if (getType(a) !== "array" && getType(a) !== "object") return b;

  // merged object/array
  const merged = deepClone(a)

  for (let key in b) {
    merged[key] = a.hasOwnProperty(key)
      ? deepJoinTwo(a[key], b[key])
      : b[key]
  }
  return merged
}

export const deepJoin = (...items) =>
  items.length === 0 ? {} :
    items.length === 1 ? items[0] :
      deepJoin(deepJoinTwo(items[0], items[1]), ...items.slice(2))

const lastPathSegmentRegex = /\.\w+$/
export const setValueInPath = (obj, path, newValueMakerThing = a => a) => {
  const lastSegmentIndex = lastPathSegmentRegex.exec(path)?.index ?? 0
  const lastSegmentKey = path.slice(lastSegmentIndex + 1)
  const directParentPath = path.slice(0,  lastSegmentIndex)
  
  const directParentObj = look(obj, directParentPath)
  
  if (!directParentObj) {
    console.error("Error in setValueInPath. Bad object/path for path", directParentPath, obj);
    return;
  }

  const oldValue = directParentObj[lastSegmentKey]
  directParentObj[lastSegmentKey] = newValueMakerThing(oldValue)
  return obj
}
