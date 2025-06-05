import { TradeOptions } from "@/types/landing";
import { useDomain } from "@/composition/useDomain";

export const useTradeConstants = () => {
  const { optionsPlatformURL } = useDomain()

  const tradeCardData = [
    {
      logo: "Finteria",
      title: `trade.tradeAtHome.finteria.title`,
      text: `trade.tradeAtHome.finteria.subtitle`,
      img: "tradeCard1",
      options: [
        `trade.tradeAtHome.finteria.list[0]`,
        `trade.tradeAtHome.finteria.list[1]`,
        `trade.tradeAtHome.finteria.list[2]`,
        `trade.tradeAtHome.finteria.list[3]`,
      ],
      button: `trade.tradeAtHome.finteria.button`,
      target: "_blank",
      link: optionsPlatformURL.value,
      isCharts: true,
    },
  ];

  const introOptionsData: Array<TradeOptions> = [
    {
      title: "trade.numCards[0].bigTitle",
      text: "trade.numCards[0].title",
      subTitle: "trade.numCards[0].subtitle",
    },
    {
      title: "trade.numCards[1].bigTitle",
      text: "trade.numCards[1].title",
      subTitle: "trade.numCards[1].subtitle",
    },
    {
      title: "trade.numCards[2].bigTitle",
      text: "trade.numCards[2].title",
      subTitle: "trade.numCards[2].subtitle",
    },
    {
      title: "trade.numCards[3].bigTitle",
      text: "trade.numCards[3].title",
      subTitle: "trade.numCards[3].subtitle",
    },
  ];

  const tradeCard = [
    {
      icon: "flag",
      title: `trade.threeSteps.list[0].title`,
      text: `trade.threeSteps.list[0].text`,
    },
    {
      icon: "wallet",
      title: `trade.threeSteps.list[1].title`,
      text: `trade.threeSteps.list[1].text`,
    },
    {
      icon: "trade",
      title: `trade.threeSteps.list[2].title`,
      text: `trade.threeSteps.list[2].text`,
    },
  ];

  const strategyOptions = [
    {
      icon: "arrow",
      title: "trade.tradingExperience.list[0].title",
      text: "trade.tradingExperience.list[0].text",
    },
    {
      icon: "arrow",
      title: "trade.tradingExperience.list[1].title",
      text: "trade.tradingExperience.list[1].text",
    },
    {
      icon: "accept",
      title: "trade.tradingExperience.list[2].title",
      text: "trade.tradingExperience.list[2].text",
      last: true,
    },
  ];

  const ideasData = [
    { title: "trade.tradingIdeas.list[0].title", img: "idea1" },
    { title: "trade.tradingIdeas.list[1].title", img: "idea2" },
    { title: "trade.tradingIdeas.list[2].title", img: "idea3" },
    { title: "trade.tradingIdeas.list[3].title", img: "idea4" },
  ];

  const choiceData = [
    {
      icon: "clock",
    },
    {
      icon: "traders",
    },
    {
      icon: "protect",
    },
    {
      icon: "advisor",
    },
    {
      icon: "wide-range",
    },
    {
      icon: "copy",
    },
    {
      icon: "calendar",
    },
    {
      icon: "support",
    },
    {
      icon: "pig",
    },
  ];

  const currencyCodesFrom: { [key: string]: string } = {
    "Europe/Amsterdam": "EUR",
    "Europe/Andorra": "EUR",
    "Europe/Athens": "EUR",
    "Europe/Belgrade": "EUR",
    "Europe/Berlin": "EUR",
    "Europe/Bratislava": "EUR",
    "Europe/Brussels": "EUR",
    "Europe/Busingen": "EUR",
    "Europe/Chisinau": "EUR",
    "Europe/Helsinki": "EUR",
    "Europe/Madrid": "EUR",
    "Europe/Paris": "EUR",
    "Europe/Riga": "EUR",
    "Europe/Rome": "EUR",
    "Europe/Vilnius": "EUR",
    "Europe/Vienna": "EUR",
    "Europe/London": "GBP",
    "Asia/Dubai": "AED",
    "Australia/Sydney": "AUD",
    "Australia/Melbourne": "AUD",
    "Australia/Lindeman": "AUD",
    "Australia/Hobart": "AUD",
    "Australia/Eucla": "AUD",
    "Australia/Darwin": "AUD",
    "Australia/Broken_Hill": "AUD",
    "Australia/Brisbane": "AUD",
    "Australia/Adelaide": "AUD",
    "Australia/Canberra": "AUD",
    "Australia/Lord_Howe": "AUD",
    "Australia/Perth": "AUD",
    "Asia/Baku": "AZN",
    "Asia/Dhaka": "BDT",
    "Europe/Sofia": "BGN",
    "America/Araguaina": "BRL",
    "America/Winnipeg": "CAD",
    "America/Toronto": "CAD",
    "America/Edmonton": "CAD",
    "America/St_Johns": "CAD",
    "America/Vancouver": "CAD",
    "America/Regina": "CAD",
    "America/Whitehorse": "CAD",
    "Europe/Zurich": "CHF",
    "Pacific/Easter": "CLP",
    "America/Bogota": "COP",
    "America/Costa_Rica": "CRC",
    "Europe/Prague": "CZK",
    "Europe/Copenhagen": "DKK",
    "America/Dominica": "DOP",
    "Africa/Algiers": "DZD",
    "Africa/Cairo": "EGP",
    "Asia/Tbilisi": "GEL",
    "Asia/Hong_Kong": "HKD",
    "Europe/Budapest": "HUF",
    "Asia/Jakarta": "IDR",
    "Asia/Jayapura": "IDR",
    "Asia/Makassar": "IDR",
    "Asia/Pontianak": "IDR",
    "Asia/Jerusalem": "ILS",
    "Asia/Kolkata": "INR",
    "Asia/Tokyo": "JPY",
    "Asia/Seoul": "KRW",
    "Asia/Kuwait": "KWD",
    "Africa/Casablanca": "MAD",
    "America/Bahia_Banderas": "MXN",
    "America/Cancun": "MXN",
    "America/Chihuahua": "MXN",
    "America/Ciudad_Juarez": "MXN",
    "America/Ensenada": "MXN",
    "America/Hermosillo": "MXN",
    "America/Matamoros": "MXN",
    "America/Mazatlan": "MXN",
    "America/Merida": "MXN",
    "America/Mexico_City": "MXN",
    "America/Monterrey": "MXN",
    "America/Ojinaga": "MXN",
    "America/Tijuana": "MXN",
    "Asia/Kuala_Lumpur": "MYR",
    "Africa/Lagos": "NGN",
    "Europe/Oslo": "NOK",
    "America/Lima": "PEN",
    "Asia/Manila": "PHP",
    "Europe/Warsaw": "PLN",
    "Europe/Bucharest": "RON",
    "Asia/Riyadh": "SAR",
    "Europe/Stockholm": "SEK",
    "Asia/Singapore": "SGD",
    "Asia/Bangkok": "THB",
    "Africa/Tunis": "TND",
    "Asia/Istanbul": "TRY",
    "Europe/Istanbul": "TRY",
    "Asia/Taipei": "TWD",
    "Europe/Kyiv": "UAH",
    "Europe/Kyev": "UAH",
    "Europe/Uzhgorod": "UAH",
    "Europe/Zaporozhye": "UAH",
    "Asia/Ho_Chi_Minh": "VND",
    "Asia/Saigon": "VND",
    "Africa/Maputo": "XAF",
    "Africa/Johannesburg": "ZAR",
  };

  return {
    tradeCardData,
    introOptionsData,
    tradeCard,
    strategyOptions,
    ideasData,
    choiceData,
    currencyCodesFrom,
  };
};
