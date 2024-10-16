
export const CompileChatTemplate = async (appName, templateOptions) => {
  const template = Handlebars.partials[`systems/r20/templates/applications/${appName}.hbs`]

  if (!template) {
    console.error(`Couldn't find handlebar template for app ${appName}. are you sure it was properly pre-loaded?`)
    return
  }

  return template(templateOptions)
}
