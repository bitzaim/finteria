import { mediaApi, optionsApi } from "./axios";
import {
  BarsParams,
  Symbol,
  SymbolLastDayPrices,
  SymbolLastPrices,
  TicksParams,
  Bar,
  Tick,
  PerfomanceInfo,
  CurrencyStrengthParams,
  CurrencyStrengthInfo,
  CryptoStrengthParams,
  CryptoStrengthInfo,
} from "./types/tools.type";

const getSymbolsList = (): Promise<Symbol[]> => {
  return optionsApi()
    .get("/symbols")
    .then((response) => response.data);
};

const getLastPrices = (): Promise<SymbolLastPrices> => {
  return optionsApi()
    .get("/get-last-prices")
    .then((response) => response.data);
};

const getLastDayPrices = (): Promise<SymbolLastDayPrices> => {
  return optionsApi()
    .get("/get-last-day-prices")
    .then((response) => response.data);
};

const getBars = (params: BarsParams): Promise<Bar[]> => {
  return optionsApi()
    .get("/get-bars", {
      params,
    })
    .then((response) => response.data);
};

const getTicks = (params: TicksParams): Promise<Tick[]> => {
  return optionsApi()
    .get("/get-ticks", {
      params,
    })
    .then((response) => response.data);
};

const getWSPricesUrl = (): string => {
  const config = useRuntimeConfig();
  return `${config.public.API_OPTIONS_URL_WEBSOCKET}/ws/prices`;
};

const getPerfomanceInfo = (ticker: string): Promise<PerfomanceInfo> => {
  return mediaApi()
    .get(`/widget/performance/${ticker}`)
    .then((response) => response.data.data);
};

const getCurrencyStrength = (params: CurrencyStrengthParams): Promise<CurrencyStrengthInfo> => {
  return mediaApi()
    .get("/widget/currency-strength", {
      params,
    })
    .then((response) => response.data.data);
};

const getCryptoStrength = (params: CryptoStrengthParams): Promise<CryptoStrengthInfo[]> => {
  return mediaApi()
    .get("/widget/crypto-strength", {
      params,
    })
    .then((response) => response.data.data);
};

export {
  getSymbolsList,
  getLastPrices,
  getLastDayPrices,
  getBars,
  getTicks,
  getWSPricesUrl,
  getPerfomanceInfo,
  getCurrencyStrength,
  getCryptoStrength,
};
