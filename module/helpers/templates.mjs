/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // PC partials
    'systems/r20/templates/actor/parts/pc-resource.hbs',
    'systems/r20/templates/actor/parts/pc-attribute.hbs',
    'systems/r20/templates/actor/parts/pc-skill.hbs',
    // Actor partials.
    'systems/r20/templates/actor/parts/actor-features.hbs',
    'systems/r20/templates/actor/parts/actor-pc-skills.hbs',
    'systems/r20/templates/actor/parts/actor-pc-attacks.hbs',
    'systems/r20/templates/actor/parts/actor-pc-attack.hbs',
    'systems/r20/templates/actor/parts/actor-items.hbs',
    'systems/r20/templates/actor/parts/actor-config.hbs',
    'systems/r20/templates/actor/parts/actor-spells.hbs',
    'systems/r20/templates/actor/parts/actor-effects.hbs',
    // Item partials
    'systems/r20/templates/item/parts/item-effects.hbs',
    
    // Chat Partials
    'systems/r20/templates/applications/chatListeners.hbs',
  ]);
};
