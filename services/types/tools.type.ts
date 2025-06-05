export type Symbol = {
  id: number;
  ticker: string;
  display_name: string;
  description: string;
  type: string;
  pricescale: number;
  payout_ratio: number;
  session: string;
  is_market_open: boolean;
  ticker_with_slash: string;
};

export type SymbolLastPrice = {
  bid: number;
  ask: number;
  mid: number;
  timestamp: number;
};

export type SymbolLastPrices = {
  [key: string]: SymbolLastPrice;
};

export type SymbolLastDayPrice = {
  open: number;
  high: number;
  low: number;
  close: number;
  datetime: number;
};

export type SymbolLastDayPrices = {
  [key: string]: SymbolLastDayPrice;
};

export type Tool = {
  id: number;
  display_name: string;
  description: string;
  type: string;
  ticker: string;
  ticker_with_slash: string;
  price: number;
  pricescale: number;
  difference_price: number | string;
  difference_percentage: number | string;
};

export type ToolDifference = {
  digit: string | number;
  percentage: string | number;
};

export type ToolDifferenceTime = {
  "1h": number | string;
  "24h": number | string;
  "1d": number | string;
  "14d": number | string;
  "30d": number | string;
  "1y": number | string;
};

export type ToolDetail = {
  ticker: string;
  ticker_with_slash: string;
  display_name: string;
  price: number;
  difference_price: number | string;
  difference_percentage: number | string;
  difference_time: ToolDifferenceTime;
};

export type MarketWatchToolData = Omit<ToolDetail, "difference_time" | "display_name"> & {
  type: string;
};

export type MarketWatchTab = {
  slug: string;
  title: string;
  data: MarketWatchToolData[];
};

export type BarsParams = {
  symbol: string;
  resolution: string;
  from: number;
  to: number;
};

export type Bar = {
  datetime: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type TicksParams = {
  symbol: string;
  from: number;
  to: number;
};

export type Tick = {
  bid: number;
  ask: number;
  mid: number;
  timestamp: number;
};

export type PerfomanceInfo = {
  price: string;
  symbol: string;
  changes_percent: ToolDifferenceTime;
};

export type ToolWithPerfomance = {
  tool?: Tool;
  perfomance: PerfomanceInfo;
};

export type CurrencyStrengthParams = Partial<{
  period: number;
  step: number;
  from_datetime: string;
  to_datetime: string;
}>;

export type CurrencyStrengthInfo = {
  [key: string]: CryptoStrengthPeriod[];
};

export type CryptoStrengthParams = Partial<{
  period: number;
  step: number;
  symbols_count: number;
  from_datetime: string;
  to_datetime: string;
}>;

export type CryptoStrengthPeriod = {
  datetime: string;
  percent_change: string;
};

export type CryptoStrengthInfo = {
  symbol: string;
  period: CryptoStrengthPeriod[];
};
