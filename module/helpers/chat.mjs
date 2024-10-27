
const defaultMessageOpts = {
  sound: "systems/r20/assets/sounds/diceroll.wav",
}
export const sendMessage = ({
  content,
  sound = defaultMessageOpts.sound,
}) => {
  return ChatMessage.implementation.create({
    content,
    sound
  })
}

