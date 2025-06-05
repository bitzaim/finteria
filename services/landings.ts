import axios from "axios";
import { accountApi, api } from "./axios";
import type { SignalProvidersOutDto } from "./types/landings.type";

const getCalculatorExchangeData = (body): Promise<any> =>
  accountApi("/calculator/exchange/calculate", { method: "POST", body });

export const getGameCalculator = (): Promise<any> => {
  return api()
    .get("/game-calculator")
    .then((response) => response.data);
};

export const getTopStrategies = (): Promise<SignalProvidersOutDto> => {
  const { $config } = useNuxtApp();
  return axios.get(`${$config.public.API_OPTIONS_URL}/signal-providers`).then((res) => res.data);
};

export const getAppSettings = () =>
  api()
    .get("/app/settings")
    .then((response) => response.data);

export default {
  getCalculatorExchangeData,
  getGameCalculator,
};
