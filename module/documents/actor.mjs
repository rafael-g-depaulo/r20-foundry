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
    systemData.resources.hp.max =
      systemData.config.lv1MaxHp +
      systemData.config.hpPerLevel * (systemData.level - 1) +
      systemData.level * systemData.CON +
      systemData.config.bonusMaxHP;
    systemData.resources.mp.max =
      systemData.config.mpPerLevel * systemData.level +
      systemData.config.bonusMaxMP;
    systemData.resources.fp.max =
      5 * systemData.level + systemData.config.bonusMaxFP;
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
    console.log("getting derived data", this);
    const actorData = this;
    /** @type {R20Character} */
    const systemData = actorData.system;
    // const flags = actorData.flags.r20 || {};

    // Ability Modifiers
    const getAbilityModifier = (abilityName) =>
      Math.floor((systemData.attributes[abilityName].value - 10) / 2);
    systemData.STR = getAbilityModifier("str");
    systemData.DEX = getAbilityModifier("dex");
    systemData.CON = getAbilityModifier("con");
    systemData.INT = getAbilityModifier("int");
    systemData.SEN = getAbilityModifier("sen");
    systemData.PRE = getAbilityModifier("pre");

    console.log("CON:", systemData);
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
