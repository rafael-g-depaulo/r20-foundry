/**
 * Manage Active Effect instances through an Actor or Item Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning document which manages this effect
 */
export function onManageActiveEffect(event, owner) {
  event.preventDefault();
  const a = event.currentTarget;
  const li = a.closest("li");
  const effect = li.dataset.effectId
    ? owner.effects.get(li.dataset.effectId)
    : null;
  switch (a.dataset.action) {
    case "create":
      return owner.createEmbeddedDocuments("ActiveEffect", [
        {
          name: game.i18n.format("DOCUMENT.New", {
            type: game.i18n.localize("DOCUMENT.ActiveEffect"),
          }),
          icon: "icons/svg/aura.svg",
          origin: owner.uuid,
          "duration.rounds":
            li.dataset.effectType === "temporary" ? 1 : undefined,
          disabled: li.dataset.effectType === "inactive",
        },
      ]);
    case "edit":
      return effect.sheet.render(true);
    case "delete":
      return effect.delete();
    case "toggle":
      return effect.update({ disabled: !effect.disabled });
  }
}

/**
 * Prepare the data structure for Active Effects which are currently embedded in an Actor or Item.
 * @param {ActiveEffect[]} effects    A collection or generator of Active Effect documents to prepare sheet data for
 * @return {object}                   Data for rendering
 */
export function prepareActiveEffectCategories(effects) {
  // Define effect header categories
  const categories = {
    temporary: {
      type: "temporary",
      name: game.i18n.localize("R20.Effect.Temporary"),
      effects: [],
    },
    passive: {
      type: "passive",
      name: game.i18n.localize("R20.Effect.Passive"),
      effects: [],
    },
    inactive: {
      type: "inactive",
      name: game.i18n.localize("R20.Effect.Inactive"),
      effects: [],
    },
  };

  // Iterate over active effects, classifying them into categories
  for (let e of effects) {
    if (e.disabled) categories.inactive.effects.push(e);
    else if (e.isTemporary) categories.temporary.effects.push(e);
    else categories.passive.effects.push(e);
  }
  return categories;
}

export const look = (obj, path) =>
  path
    .split(".")
    .filter((a) => a !== "")
    .reduce((acc, cur) => {
      if (typeof acc !== 'object' || acc === null) {
        console.error("tried to access non-object", cur, acc)
        return null
      }
      if (!acc.hasOwnProperty(cur)) {
      console.error(`ERROR! couldn't find ${cur} in object:`, acc)
        console.trace()
        return null
      }
      
      // console.log(`found value for key ${cur} in obj`, acc)
      return acc[cur]
    }, obj);

export const detailLook = (obj, ...path) =>
  path.length === 0 ? obj : detailLook(obj[path[0]], ...path.slice(1))

