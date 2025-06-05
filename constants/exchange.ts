import { OlItems, SmallOptions, TradeOptions } from "@/types/landing";

export const defaultState = {
  to_amount: null,
  rate: null,
  id: null,
  expire_at: null,
  expire_seconds: null,
};

export const useExchangeConstants = () => {
  const introOptionsData: TradeOptions[] = [
    {
      title: "exchange.numCards[0].bigTitle",
      text: "exchange.numCards[0].title",
      subTitle: "exchange.numCards[0].subtitle",
    },
    {
      title: "exchange.numCards[1].bigTitle",
      text: "exchange.numCards[1].title",
      subTitle: "exchange.numCards[1].subtitle",
    },
    {
      title: "exchange.numCards[2].bigTitle",
      text: "exchange.numCards[2].title",
      subTitle: "exchange.numCards[2].subtitle",
    },
    {
      title: "exchange.numCards[3].bigTitle",
      text: "exchange.numCards[3].title",
      subTitle: "exchange.numCards[3].subtitle",
    },
  ];

  const smallItems: SmallOptions[] = [
    {
      text: "exchange.smallNumCards[0].text",
      icon: "exchange.smallNumCards[0].icon",
    },
    {
      text: "exchange.smallNumCards[1].text",
      icon: "exchange.smallNumCards[1].icon",
    },
    {
      text: "exchange.smallNumCards[2].text",
      icon: "exchange.smallNumCards[2].icon",
    },
    {
      text: "exchange.smallNumCards[3].text",
      icon: "exchange.smallNumCards[3].icon",
    },
  ];

  const olItems: OlItems[] = [
    {
      title: "exchange.infoBlock.left_items[0].title",
      text: "exchange.infoBlock.left_items[0].text",
    },
    {
      title: "exchange.infoBlock.left_items[1].title",
      text: "exchange.infoBlock.left_items[1].text",
    },
  ];

  const ulItems: string[] = [
    "exchange.infoBlock.right_items[0]",
    "exchange.infoBlock.right_items[1]",
    "exchange.infoBlock.right_items[2]",
    "exchange.infoBlock.right_items[3]",
  ];

  return {
    introOptionsData,
    smallItems,
    olItems,
    ulItems,
  };
};
