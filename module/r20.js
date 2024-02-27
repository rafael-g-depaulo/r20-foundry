
import { BoilerplateItemSheet } from "./sheets/item-sheet.mjs"
import R20ItemSheet from "./sheets/r20ItemSheet.js"


console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")
console.error("LISTENNNNNNNNNNNN")

Hooks.once("init", () => {
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")
  console.log("started!!!!")

  Items.unregisterSheet("core", ItemSheet)
  Items.unregisterSheet("core", BoilerplateItemSheet)
  Items.registerSheet("r20", R20ItemSheet)
})
