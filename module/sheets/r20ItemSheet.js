export class R20ItemSheet extends ItemSheet {

  get template() {
    return `systems/r20/templates/sheets/${this.item.data.type}-sheet.html`
  }
}
