import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";
import { addTag, removeTag } from "./item-sheet-actions.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class R20ItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["r20", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "attributes",
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = "systems/r20/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    const itemSheetTypes = ["weapon"];
    if (itemSheetTypes.includes(this.item.type))
      return `${path}/item-${this.item.type}-sheet.hbs`;

    return `${path}/item-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.data;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = this.item.getRollData();

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Prepare active effects for easier access
    context.effects = prepareActiveEffectCategories(this.item.effects);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.on("click", ".effect-control", (ev) =>
      onManageActiveEffect(ev, this.item)
    );

    html.on("click", ".sheet-action", (ev) => this._onSheetAction(ev));
  }

  _onSheetAction(event) {
    event.preventDefault();
    const { dataset } = event.currentTarget;
    const { action } = dataset;
    const object = this.object;

    const actionHandlers = [addTag, removeTag];
    const actionHandlerMapper = Object.fromEntries(actionHandlers);

    if (!actionHandlerMapper[action]) {
      return console.error(
        `Invalid sheet action. Got ${action}. Valid actions are:`,
        Object.keys(actionHandlerMapper)
      );
    }

    actionHandlerMapper[action]({ dataset, object });
  }
}
