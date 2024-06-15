export const editItem = async (actor, itemId, itemDiff = {}) => {
  return actor.updateEmbeddedDocuments("Item", [
    { _id: itemId, ...itemDiff },
  ]);
}

export const setItemFlag = (actor, itemId, flagKey, flagValue) => {
  const item = actor.getEmbeddedDocument("Item", itemId)
  return item.setFlag("r20", flagKey, flagValue)
}
