import { getServerRequest } from "@/services/axios";

export const getCalculatorTradeData = async () => {
  const { data } = await getServerRequest("/trade-calculator", {
    method: "GET",
    key: "calculatorTrade",
  });

  return data.value;
};

export const getExchangeData = async () => {
  const { data } = await getServerRequest("/assets/exchange", {
    method: "GET",
    key: "calculatorExchange",
  });

  return data.value;
};
