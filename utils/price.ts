const formatPriceComma = (price: number, fractionDigits: number = 2): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
  });

  return formatter.format(price);
};

const formatPriceSpace = (price: number): string => {
  return price.toLocaleString("ru");
};

export { formatPriceComma, formatPriceSpace };
