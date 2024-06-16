const diceRollRegex = /(?<diceAmmount>\d*)(?<restRoll>d.*)/;
export const multiplyDice = (rollStr, multiplier) => {
  if (!diceRollRegex.test(rollStr)) {
    console.error(
      `Errored when trying to multiply roll "${rollStr}" by ${multiplier}`
    );
    return rollStr;
  }

  const { diceAmmount, restRoll } = diceRollRegex.exec(
    rollStr,
    multiplier
  ).groups;

  const newDiceAmmount =
    diceAmmount === ""
      ? `${multiplier}`
      : `${Number(diceAmmount) * multiplier}`;

  return `${newDiceAmmount}${restRoll}`;
};
