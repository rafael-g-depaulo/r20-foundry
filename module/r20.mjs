// Import document classes.
import { R20Actor } from "./documents/actor.mjs";
import { R20Item } from "./documents/item.mjs";
// Import sheet classes.
import { R20ActorSheet } from "./sheets/actor-sheet.mjs";
import { R20ItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { R20 } from "./helpers/config.mjs";
import { getAttributeModifierStr } from "./businessLogic/attributeModifier.mjs";
import { detailLook, look } from "./helpers/effects.mjs";
import { R20Combat } from "./combat/combat.mjs";
import { R20CombatTracker } from "./combat/combatTracker.mjs";
import { R20Combatant } from "./combat/combatant.mjs";
import { getWeaponCritStr } from "./businessLogic/weaponCrit.mjs";
import { getWeapon } from "./businessLogic/weapon.mjs";
import { R20ActiveEffect } from "./documents/activeEffect.mjs";
import { WeaponDataModel } from "./dataModels/weapon.mjs";
import { PcDataModel } from "./dataModels/pc.mjs";
import { activateChatListeners } from "./listeners/chatListeners.mjs";
import { NpcDataModel } from "./dataModels/npc.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.r20 = {
    R20Actor,
    R20Item,
    R20Combat,
    R20CombatTracker,
    rollItemMacro,
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @skills.initiative.total",
    decimals: 2,
  };

  // Define custom Document classes
  CONFIG.R20 = R20;
  CONFIG.ui.combat = R20CombatTracker;
  CONFIG.Combat.documentClass = R20Combat;
  CONFIG.Actor.documentClass = R20Actor;
  CONFIG.Item.documentClass = R20Item;
  CONFIG.Combatant.documentClass = R20Combatant;
  CONFIG.ActiveEffect.documentClass = R20ActiveEffect;

  // Register Data Models. (see: https://foundryvtt.com/article/system-data-models/)
  CONFIG.Item.dataModels.weapon = WeaponDataModel;
  CONFIG.Actor.dataModels.pc = PcDataModel;
  CONFIG.Actor.dataModels.npc = NpcDataModel;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("r20", R20ActorSheet, {
    makeDefault: true,
    label: "R20.SheetLabels.Actor",
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("r20", R20ItemSheet, {
    makeDefault: true,
    label: "R20.SheetLabels.Item",
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

// Used for checkboxes linked to a bool variable
Handlebars.registerHelper("checked", function (currentValue) {
  return currentValue == "1" ? " checked" : "";
});

Handlebars.registerHelper("selectedIfEquals", function (a, b) {
  return a == b ? " selected" : "";
});

Handlebars.registerHelper("log", (...args) =>
  console.log(...args.slice(0, -1))
);
Handlebars.registerHelper("showJson", (...args) =>
  args
    .slice(0, -1)
    .map(arg => JSON.stringify(arg, null, 2))
    .join("\n")
)

Handlebars.registerHelper("look", look);
Handlebars.registerHelper("detailLook", (...args) =>
  detailLook(...args.slice(0, -1))
);
Handlebars.registerHelper("at", (arr, i) => arr.at(i));
Handlebars.registerHelper("equals", (a, b) => a == b);
Handlebars.registerHelper("hidrateNpc", (npcSystemData) => {
  const hidratedNpc = CONFIG.Actor.dataModels.npc.fromSource(npcSystemData)
  // hidratedNpc.populateExternalIds({ items })
  // hidratedNpc.populateVirtualProps()
  return hidratedNpc
})
Handlebars.registerHelper("hidratePc", (pcSystemData, opts) => {
  const actor = opts.data.root.actor
  const hidratedPc = CONFIG.Actor.dataModels.pc.fromSource(pcSystemData, { parent: actor })
  const items = actor.items
  hidratedPc.populateExternalIds({ items })
  hidratedPc.populateVirtualProps()
  return hidratedPc
})
Handlebars.registerHelper("setVar", (varName, varValue, opts) => {
  opts.data.root[varName] = varValue;
})

/// Business Rules related helpers //////////////////////////
/// Business Rules related helpers //////////////////////////
Handlebars.registerHelper("attbMod", getAttributeModifierStr);
Handlebars.registerHelper(
  "attbModLookup",
  function (attributes, attributeName) {
    return getAttributeModifierStr(attributes[attributeName]);
  }
);
Handlebars.registerHelper(
  "canIncreaseSkill",
  (skillValue, skillMax, skillPointsAvailable) =>
    skillPointsAvailable <= 0 || skillValue >= skillMax ? " disabled" : ""
);
Handlebars.registerHelper("canDecreaseSkill", (skillValue) =>
  skillValue > 0 ? "" : " disabled"
);
Handlebars.registerHelper("weaponCrit", getWeaponCritStr);
Handlebars.registerHelper("getWeapon", getWeapon);
/// Business Rules related helpers //////////////////////////
/// Business Rules related helpers //////////////////////////

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
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
  if (data.type !== "Item") return;
  if (!data.uuid.includes("Actor.") && !data.uuid.includes("Token.")) {
    return ui.notifications.warn(
      "You can only create macro buttons for owned Items"
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
      type: "script",
      img: item.img,
      command: command,
      flags: { "r20.itemMacro": true },
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
    type: "Item",
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


Hooks.on("renderChatMessage", (message, html, opts) => {
  activateChatListeners(html)
})
Hooks.once("renderChatLog", (_, html) => activateChatListeners(html))
