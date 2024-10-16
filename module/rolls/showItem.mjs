import { CompileChatTemplate } from "../../lib/handlebarsUtils/compileChatTemplate.mjs"
import { sendMessage } from "../helpers/chat.mjs"

export const showItem = [
  "show-item",
  async ({ actor, dataset }) => {
    console.log("Hi, im trying to show the item", dataset, actor)

    const messageHtmlContent = await CompileChatTemplate("chatListeners", { var: "is it working?" })
    
    return sendMessage({
      content: messageHtmlContent,
    })
  }
]
