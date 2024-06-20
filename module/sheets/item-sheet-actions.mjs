
export const addTag = [
  "add-tag",
  async ({ dataset, object }) => {
    return object.update({
      system: {
        tags: [...object.system.tags, "tag"]
      }
    })
  }
]

export const removeTag = [
  "remove-tag",
  async ({ dataset, object }) => {
    object.system.tags.splice(dataset.tagIndex, 1)
    return object.update({ system: { tags: object.system.tags } })
  }
]
