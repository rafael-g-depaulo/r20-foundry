export const fixExtraPropertiesArray = (system) => {
  system.extraProperties ??= []
  const extraPropsConfigArray = system.extraProperties

  extraPropsConfigArray.forEach((prop, i) => {
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
