export const roundFixed = (value: number, decimals: number): number => {
  const fixedValue = value.toFixed(decimals);

  return parseFloat(fixedValue);
};
