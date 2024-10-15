
const chatActionHandlers = Object.fromEntries([
])

export const activateChatListeners = (html) => {
  html.on("click", ".chat-action", event => {
    const { action, ...data } = event.currentTarget?.dataset ?? {}
    const handler = chatActionHandlers[action]
    
    if (!handler) {
      console.error(`No chat action handler found for action "${action}".`, event.currentTarget)
      return
    }

    handler(data)
  })
}
