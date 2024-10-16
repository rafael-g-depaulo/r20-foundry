import { rollAttack, rollCriticalDamage, rollNormalDamage } from "../businessLogic/rollAttack.mjs";
import { rollAttributeResistance } from "../businessLogic/rollResistance.mjs";
import { rollSkill } from "../businessLogic/rollSkill.mjs";
import { R20Item } from "../documents/item.mjs";
import { groupBy } from "../helpers/array.mjs";
import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";
import { deepJoin, getPath, makeEntry } from "../helpers/object.mjs";
import { showItem } from "../rolls/showItem.mjs";
import {
  addExtraProperty,
  addNewAttack,
  decreaseSkillProf,
  editAttack,
  increaseSkillProf,
  removeAttack,
  removeAttackConfim,
  removeExtraProperty,
  setViewAttack,
  toggleItemEquip,
} from "./pc-sheet-actions.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class R20ActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["r20", "sheet", "actor"],
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "attacks",
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/r20/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();
    console.log("getData with context", context);

    // Use a safe clone of the actor data for further operations.
    const actorData = context.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type === "pc") {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    //
    // // Prepare NPC data and items.
    // if (actorData.type == 'npc') {
    //   this._prepareItems(context)
    // }
    //
    // // Add roll data for TinyMCE editors.
    // context.rollData = context.actor.getRollData()

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    )

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    // console.clear()
    // for (let [k, v] of Object.entries(context.system.abilities ?? {})) {
    //   v.label = game.i18n.localize(CONFIG.R20.abilities[k]) ?? k
    // }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // // Initialize containers.
    // const gear = []
    // const features = []
    // const spells = {
    //   0: [],
    //   1: [],
    //   2: [],
    //   3: [],
    //   4: [],
    //   5: [],
    //   6: [],
    //   7: [],
    //   8: [],
    //   9: [],
    // }
    //
    // // Iterate through items, allocating to containers
    // for (let i of context.items) {
    //   i.img = i.img || Item.DEFAULT_ICON
    //   // Append to gear.
    //   if (i.type === 'item') {
    //     gear.push(i)
    //   }
    //   // Append to features.
    //   else if (i.type === 'feature') {
    //     features.push(i)
    //   }
    //   // Append to spells.
    //   else if (i.type === 'spell') {
    //     if (i.system.spellLevel != undefined) {
    //       spells[i.system.spellLevel].push(i)
    //     }
    //   }
    // }
    //
    // // Assign and return
    // context.gear = gear
    // context.features = features
    // context.spells = spells

    // context.gear = [...(context.weapons ?? []), ...(context.armor ?? [])]
    // console.clear();
    // console.log(context);
    // this.attacksState = context.attacksState = context.system.attacks.map(() => "view");
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on("click", ".item-edit", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on("click", ".item-create", this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on("click", ".item-delete", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on("click", ".effect-control", (ev) => {
      const row = ev.currentTarget.closest("li");
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on("click", ".rollable", this._onRoll.bind(this));

    // Sheet action
    html.on("click", ".sheet-action", this._onSheetAction.bind(this));

    // input that changes item
    html.on("change", ".item-input", this._onItemInput.bind(this));

    html.on("change", ".attack-input", this._onAttackInput.bind(this))

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find("li.item").each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  async _onItemInput(event) {
    event.preventDefault();
    const actor = this.actor;
    const { dataset } = event.currentTarget;
    const inputData = await event.result;

    console.log("))))))))))))))))))))))))))))))))))", {dataset, inputData, actor})

    const itemChangesList = Object.entries(inputData)
      .filter(([key]) => key.startsWith("items."))
      .map(([key, value]) => {
        const extractItemIdAndPath = /items\.([^\.]+)(\..+)/;
        const [, id, path] = extractItemIdAndPath.exec(key) ?? [];
        const item = actor.items.get(id);
        if (!item) {
          console.error(`Tried to update ${key} in actor but errored`, actor);
          return;
        }
        // const item = actor?.getEmbeddedDocuments("Item", [id])
        // console.log("editing item", item)

        return [id, getPath(path), value];
      })
      .filter((a) => !!a);

    const itemChangeListsByItem = groupBy((a) => a[0], itemChangesList);

    const itemChanges = Object.entries(itemChangeListsByItem)
      .map(([id, changeList]) => [
        id,
        changeList
          // remove unecessary id marker
          .map((change) => change.slice(1))
          .map(([path, value]) => makeEntry(path, value)),
      ])
      .map(([id, changelist]) => [id, deepJoin(...changelist)])
      .map(([_id, changeObj]) => ({ _id, ...changeObj }));
    // .forEach(([id, changeObj]) => [actor]);
    //.reduce((acc, cur) => ({... acc, }), {});

    await actor.updateEmbeddedDocuments("Item", itemChanges)

    console.log("SOOOOOOO", itemChanges);
  }

  /**
   * @param {Event} event
   */
  async _onSheetAction(event) {
    event.preventDefault();

    const { dataset } = event.currentTarget;
    const { action } = dataset;
    const actor = this.actor;

    const actionHandlers = [
      increaseSkillProf,
      decreaseSkillProf,
      toggleItemEquip,
      addNewAttack,
      editAttack,
      removeAttack,
      removeAttackConfim,
      setViewAttack,
      addExtraProperty,
      removeExtraProperty,
    ];
    const actionHandlerMapper = Object.fromEntries(actionHandlers);

    if (!actionHandlerMapper[action]) {
      return console.error(
        `Invalid sheet action. Got ${action}. Valid actions are:`,
        Object.keys(actionHandlerMapper)
      );
    }

    actionHandlerMapper[action]({ actor, dataset });
  }

  async _onAttackInput(event) {
    event.preventDefault()

    const { dataset, value, checked } = event.currentTarget
    const attackIndex = parseInt(dataset.attackIndex)
    const { dtype, property } = dataset

    if (isNaN(attackIndex)) {
      console.error(`Bad Template. attack input without attackIndex. event:`, { event })
      return
    }

    const attacksArr = this.actor.system.attacks
    
    if (! property in attacksArr[attackIndex]) {
      console.error(`Bad Template. attack input without proper property`, { property, event })
      return
    }

    // update prop
    if (dtype === "Boolean") {
      attacksArr[attackIndex][property] = checked
    } else if (dtype === "Number") {
      attacksArr[attackIndex][property] = Number(value)
    } else {
      attacksArr[attackIndex][property] = value
    }
    attacksArr[attackIndex].state = "edit"

    return this.actor.update({
      system: {
        attacks: attacksArr
      }
    })
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    console.log(itemData, header.dataset);
    // Finally, create the item!
    return await R20Item.create(itemData, { parent: this.actor });
  }

  // /**
  //  * Handle clickable rolls.
  //  * @param {Event} event   The originating click event
  //  * @private
  //  */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = this.actor;
    const { rollType } = dataset;

    const rollHandlers = [rollAttributeResistance, rollSkill, rollAttack, rollNormalDamage, showItem, rollCriticalDamage];
    const rollHandlerMapper = Object.fromEntries(rollHandlers);

    if (!rollHandlerMapper[rollType]) {
      return console.error(
        `Invalid roll type. Got ${rollType}. Valid actions are:`,
        Object.keys(rollHandlerMapper)
      );
    }

    rollHandlerMapper[rollType]({ actor, dataset });

    // handle typed rolls
    // switch (dataset.rollType) {
    //   case "attribute":
    //     rollAttributeResistance(this.actor, dataset)

    //     // const { attributeName } = dataset;
    //     // const attribute = pc.attributes[attributeName];

    //     // const roll = new Roll(`1d20 + @prof + @attb`, {
    //     //   prof: getProficiencyBonus(pc, attributeName),
    //     //   attb: getAttributeModifier(attribute),
    //     // });

    //     // roll.evaluate().then(() => {
    //     //   const message = roll.toMessage({
    //     //     // content: `test message!!!!!! rolling ${attributeName} for ${this.actor.name}`,
    //     //     flavor: `${this.actor.name}: Rolando resistência (${attributeName})`,
    //     //     speaker: ChatMessage.getSpeaker(),
    //     //     user: this.actor._id,
    //     //   });
    //     //   return message;
    //     // });

    //     break;
    // }

    // // Handle item rolls.
    // if (dataset.rollType) {
    //   if (dataset.rollType == 'item') {
    //     const itemId = element.closest('.item').dataset.itemId
    //     const item = this.actor.items.get(itemId)
    //     if (item) return item.roll()
    //   }
    // }

    // Handle rolls that supply the formula directly.
    // if (dataset.roll) {
    //   let label = dataset.label ? `[ability] ${dataset.label}` : "";
    //   let roll = new Roll(dataset.roll, this.actor.getRollData());
    //   roll.toMessage({
    //     speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    //     flavor: label,
    //     rollMode: game.settings.get("core", "rollMode"),
    //   });
    //   return roll;
    // }
  }
}
