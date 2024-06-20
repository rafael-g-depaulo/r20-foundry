const initialPropName = "propriedade"

export const newExtraProperty = () => ({
  name: initialPropName,
  type: "number",
  value: 0,
  unused: true,
});

export const fixExtraPropertiesArray = (system) => {
  console.log("!@#")
  system.config._extraProps ??= []
  const extraPropsConfigArray = system.config._extraProps

  extraPropsConfigArray.forEach((prop, i) => {
    console.log("FIXING", i, prop)
    if (prop.name === initialPropName)
      return

    const propValue =
      prop.type === "number" ? Number(prop.value) :
        prop.type === "bool" ? !(prop.value === "false") : prop.value

    system.extras[prop.name] = propValue
    // if (prop.type === "number") arr[i] = { ...prop, value: Number(prop.value) };
    // if (prop.type === "bool")
    //   arr[i] = { ...prop, value: !(prop.value === "false") };
  })


  console.log("FIXING", system)
};
