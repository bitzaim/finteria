import {
  Symbol,
  SymbolLastPrice,
  SymbolLastDayPrice,
  SymbolLastPrices,
  Tool,
  SymbolLastDayPrices,
  ToolDifference,
} from "@/services/types/tools.type";
import { roundFixed } from "./digits";
import { utcToZonedTime } from "date-fns-tz";

export const getDifferenceFormatted = (diff: number | string, percentageSymbol: boolean = true): string => {
  const diffNumber = Number(diff);
  const diffWithSign = diffNumber > 0 ? `+${diffNumber}` : `${diffNumber}`;
  return percentageSymbol ? `${diffWithSign}%` : diffWithSign;
};

export const getTickerBeforeSlash = (tickerWithSlash: string): string | null => {
  const [partBeforeSlash] = tickerWithSlash.split("/");
  return partBeforeSlash?.toLowerCase();
};

export const getDifferenceByLastPrices = (lastDayPrice: number, lastPrice: number): ToolDifference => {
  const lastPriceToLastDayPrice = lastDayPrice === 0 ? 1 : lastPrice / lastDayPrice;
  const differenceDigit = roundFixed(lastPrice - lastDayPrice, 5);

  return {
    digit: differenceDigit,
    percentage: lastPriceToLastDayPrice ? ((lastPriceToLastDayPrice - 1) * 100).toFixed(2) : 0,
  };
};

export const getAdaptedToolsData = (
  symbols: Symbol[],
  lastPrices: SymbolLastPrices | null,
  lastDayPrices: SymbolLastDayPrices | null,
  filterType?: string
): Tool[] => {
  let filteredSymbols = [...symbols];

  if (filterType) {
    filteredSymbols = symbols?.filter((symbol) => symbol.type === filterType);
  }

  return filteredSymbols?.map((symbol) => {
    const symbolLastPrice: SymbolLastPrice | null = lastPrices && lastPrices[symbol.ticker];
    const symbolLastDayPrice: SymbolLastDayPrice | null = lastDayPrices && lastDayPrices[symbol.ticker];
    let difference: ToolDifference = { digit: 0, percentage: 0 };

    if (symbolLastPrice && symbolLastDayPrice) {
      difference = getDifferenceByLastPrices(symbolLastDayPrice.close, symbolLastPrice.mid);
    }

    return {
      id: symbol.id,
      display_name: symbol.display_name,
      description: symbol.description,
      type: symbol.type,
      ticker: symbol.ticker,
      ticker_with_slash: symbol.ticker_with_slash,
      price: symbolLastPrice?.mid || 0,
      pricescale: symbol.pricescale,
      difference_price: difference.digit,
      difference_percentage: difference.percentage,
    };
  });
};

export const getTickerInKebabCase = (tickerWithSlash: string): string => {
  return tickerWithSlash.toLowerCase().replace("/", "-");
};

export const getTickerCapitalize = (tickerWithSlash: string): string => {
  return tickerWithSlash.replace(/[\/-]/, "").toUpperCase();
};

export const getStartDateForChart = (): Date => {
  const date = new Date();
  let dateTimezone = utcToZonedTime(date, "America/New_York");

  dateTimezone.setMinutes(0);
  dateTimezone.setSeconds(0);
  dateTimezone.setMilliseconds(0);

  return dateTimezone;
};
