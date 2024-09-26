import { getAttributeModifier } from "../businessLogic/attributeModifier.mjs";
import { fixExtraPropertiesArray } from "../businessLogic/extraProperty.mjs";
import { getMaxCapacity } from "../businessLogic/inventory.mjs";
import {
  leftOverSkillPoints,
  maxSkillProficiency,
  totalSkillPoints,
} from "../businessLogic/skills.mjs";
import { getItemCategory } from "../businessLogic/weapon.mjs";
import { PcDataModel } from "../dataModels/pc.mjs";
import { recursiveFixArraysInplace } from "../helpers/array.mjs";
import { getDefense, getDodge, getGuard } from "../helpers/defense.mjs";

// TODO: make this generic and extract R20Pc stuff into separate class

/**
 * @typedef {import('../typedefs/PcTypedef.mjs').R20Pc} R20Pc
 */

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 * @extends {R20Pc}
 */
export class R20Actor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().

    // console.log("PRE-FIXING", this.system)
    // this.system = recursiveFixArraysInplace(this.system);
    // fixExtraPropertiesArray(this.system)
    // console.log("FIXING", this.system)

    // prepare derived data once first because it's used in prepareBaseData
    this.prepareDerivedData();

    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.

    const actorData = this;
    /** @type {R20Pc} */
    const systemData = actorData.system;

    // Resources
    // TODO: add all of those into populateVirtualProps
    systemData.updateMaxResources();
    systemData.updateMaxSkillProficiency()
    // systemData.populateExtraProps()
    systemData.updateVirtualProps()
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    /** @type {R20Character} */
    const systemData = actorData.system;
    // const flags = actorData.flags.r20 || {};

    // Skill totals
    const skillsList = Object.keys(systemData.skills);
    skillsList.forEach((skillName) => {
      /** @type import("../typedefs/CharacterTypedef.mjs").Skill */
      const skill = systemData.skills[skillName];
      skill.total =
        getAttributeModifier(systemData.attributes[skill.attribute]) +
        skill.proficiency +
        skill.bonus;
    });

    systemData.totalSkillPoints = totalSkillPoints(systemData);
    systemData.openSkillPoints = leftOverSkillPoints(systemData);
    systemData.updateMaxSkillProficiency()

    const items = actorData.items;
    const weapons = getItemCategory(items, "weapon");
    const armor = getItemCategory(items, "armor");
    const attacks = getItemCategory(items, "attack");

    systemData.weapons = weapons;
    systemData.armor = armor;
    systemData.gear = [...weapons, ...armor];
    systemData.items = [...systemData.gear]
    systemData.attacks = attacks;

    // console.log({ systemData })
    // systemData.attacks.forEach(attack => attack.weapon = getWeapon(weapons, attack.weaponId))
    // console.log("derived", systemData)

    // carry capacity
    systemData.itemCapacity = getMaxCapacity(systemData);
    systemData.currentCapacity = systemData.items
      .map((item) => item.system.quantity * item.system.weight)
      .reduce((a, b) => a + b, 0);

    // defenses
    systemData.guard = getGuard(systemData)
    systemData.dodge = getDodge(systemData)
    systemData.defense = getDefense(systemData)
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with `this.system`
    const data = { ...super.getRollData() };

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== "pc") return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== "npc") return;

    // Process additional NPC data here.
  }
}
