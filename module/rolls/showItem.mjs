import { CompileChatTemplate } from "../../lib/handlebarsUtils/compileChatTemplate.mjs"
import { sendMessage } from "../helpers/chat.mjs"

export const showItem = [
  "show-item",
  async ({ actor, dataset }) => {
    const { itemId } = dataset

    const item = actor.items.get(itemId)

    if (!item) {
      console.error(`Item not found when tring to show item with id ${itemId}`)
      return
    }

    const messageHtmlContent = await CompileChatTemplate("showItem", { item })
    
    return sendMessage({
      content: messageHtmlContent,
    })
  }
]
