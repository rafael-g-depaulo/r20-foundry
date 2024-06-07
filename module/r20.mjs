// Import document classes.
import { R20Actor } from './documents/actor.mjs';
import { R20Item } from './documents/item.mjs';
// Import sheet classes.
import { R20ActorSheet } from './sheets/actor-sheet.mjs';
import { R20ItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { R20 } from './helpers/config.mjs';
import { getAttributeModifierStr } from './businessLogic/attributeModifier.mjs';
import { look } from './helpers/effects.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  console.log("bitchin")
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.r20 = {
    R20Actor,
    R20Item,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.R20 = R20;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = R20Actor;
  CONFIG.Item.documentClass = R20Item;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('r20', R20ActorSheet, {
    makeDefault: true,
    label: 'R20.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('r20', R20ItemSheet, {
    makeDefault: true,
    label: 'R20.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

// Used for checkboxes linked to a bool variable
Handlebars.registerHelper('checked', function (currentValue) {
  return currentValue == '1' ? ' checked' : '';
});

Handlebars.registerHelper('selectedIfEquals', function (a, b) {
  return a == b ? ' selected' : '';
})

Handlebars.registerHelper('log', (...args) => console.log(...args.slice(0, -1)))

Handlebars.registerHelper('look', look)


/// Business Rules related helpers //////////////////////////
/// Business Rules related helpers //////////////////////////
Handlebars.registerHelper('attbMod', getAttributeModifierStr)
Handlebars.registerHelper('attbModLookup', function (attributes, attributeName) { return getAttributeModifierStr(attributes[attributeName]) })
/// Business Rules related helpers //////////////////////////
/// Business Rules related helpers //////////////////////////

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.r20.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'r20.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
