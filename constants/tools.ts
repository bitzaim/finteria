import type { PeriodsDatetimeList, PeriodsList } from "@/types/tools.type";
import { formatDatetime } from "@/utils/date";
import { getStartDateForChart } from "@/utils/tools";
import { subDays, addDays, startOfWeek, sub, add, startOfMonth } from "date-fns";

export const CRYPTO_TRADING_LIST_ITEMS = [
  {
    title: "cryptocurrency.tradingCheckList[0].title",
    text: "cryptocurrency.tradingCheckList[0].text",
  },
  {
    title: "cryptocurrency.tradingCheckList[1].title",
    text: "cryptocurrency.tradingCheckList[1].text",
  },
  {
    title: "cryptocurrency.tradingCheckList[2].title",
    text: "cryptocurrency.tradingCheckList[2].text",
  },
];

export const CRYPTO_WHY_FINTERIA_CHECKLIST = [
  {
    title: "cryptocurrency.whyFinteriaCheckList[0].title",
    text: "cryptocurrency.whyFinteriaCheckList[0].text",
  },
  {
    title: "cryptocurrency.whyFinteriaCheckList[1].title",
    text: "cryptocurrency.whyFinteriaCheckList[1].text",
  },
  {
    title: "cryptocurrency.whyFinteriaCheckList[2].title",
    text: "cryptocurrency.whyFinteriaCheckList[2].text",
  },
  {
    title: "cryptocurrency.whyFinteriaCheckList[3].title",
    text: "cryptocurrency.whyFinteriaCheckList[3].text",
  },
];

export const CRYPTO_STEP_LIST = [
  {
    title: "trade.threeSteps.list[0].title",
    text: "trade.threeSteps.list[0].text",
    slug: "flag",
  },
  {
    title: "trade.threeSteps.list[1].title",
    text: "trade.threeSteps.list[1].text",
    slug: "wallet",
  },
  {
    title: "trade.threeSteps.list[2].title",
    text: "trade.threeSteps.list[2].text",
    slug: "trade",
  },
];

export const LINE_CHART_OPTIONS = {
  plugins: {
    title: {
      display: true,
      text: "",
      font: {
        size: 18,
      },
    },
    datalabels: {
      anchor: "start",
      align: "right",
      offset: -18,
      borderWidth: 1,
      borderRadius: 10,
      color: "#fff",
      backgroundColor: (context: any) => {
        return String(context.dataset.borderColor);
      },
      padding: {
        top: 5,
        bottom: 5,
        right: 5,
        left: 5,
      },
      display: (context: any) => {
        const lastIndex = context.dataset.data.length - 1;
        return context.dataIndex === lastIndex;
      },
      formatter: (value: number, context: any) => {
        const lastIndex = context.dataset.data.length - 1;
        return context.dataIndex === lastIndex ? Math.round(value) : value;
      },
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        boxWidth: 15,
        boxHeight: 15,
      },
    },
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: false,
    },
  },
};

export const SYMBOL_COLOR_MAP: { [key: string]: string } = {
  "XRP/USD": "#191919",
  "UNI/USD": "#0075dc",
  "TRX/USD": "#ac4fc6",
  "SOL/USD": "#ff0010",
  "NEAR/USD": "#ff5005",
  "MATIC/USD": "#2bce48",
  "BTC/USD": "#ffc600",
  "ETH/USD": "#993f00",
  "LTC/USD": "#f87979",
  "LINK/USD": "#f5deb3",
  "ADA/USD": "#0075dc",
  "DOT/USD": "#f5deb3",
  "DOGE/USD": "#ff5005",
  iUSD: "#ffc600",
  iEUR: "#191919",
  iGBP: "#993f00",
  iAUD: "#0075dc",
  iNZD: "#ac4fc6",
  iCAD: "#ff0010",
  iCHF: "#ff5005",
  iJPY: "#2bce48",
};

export const PERIODS_LIST: PeriodsList = {
  "5min": {
    title: "strength.periods.5min",
    minutes: 5,
    step: 1,
    format: formatDatetimeChart,
  },
  "15min": {
    title: "strength.periods.15min",
    minutes: 15,
    step: 1,
    format: formatDatetimeChart,
  },
  "30min": {
    title: "strength.periods.30min",
    minutes: 30,
    step: 1,
    format: formatDatetimeChart,
  },
  "1h": {
    title: "strength.periods.1h",
    minutes: 60,
    step: 5,
    format: formatDatetimeChart,
  },
  "4h": {
    title: "strength.periods.4h",
    minutes: 240,
    step: 30,
    format: formatDatetimeChart,
  },
  "8h": {
    title: "strength.periods.8h",
    minutes: 480,
    step: 30,
    format: formatDatetimeChart,
  },
  "12h": {
    title: "strength.periods.12h",
    minutes: 720,
    step: 60,
    format: formatDatetimeChart,
  },
  "24h": {
    title: "strength.periods.24h",
    minutes: 1440,
    step: 60,
    format: formatDatetimeChart,
  },
  "72h": {
    title: "strength.periods.72h",
    minutes: 4320,
    step: 60,
    format: formatDatetimeChart,
  },
  "1w": {
    title: "strength.periods.1w",
    minutes: 10080,
    step: 1440,
    format: formatDatetimeChart,
  },
  "2w": {
    title: "strength.periods.2w",
    minutes: 20160,
    step: 1440,
    format: formatDatetimeChart,
  },
  "1M": {
    title: "strength.periods.1m",
    minutes: 43200,
    step: 1440,
    format: formatDatetimeChart,
  },
};

export const PERIODS_DATETIME_LIST: PeriodsDatetimeList = {
  today: {
    title: "strength.periods.today",
    btnTitle: "strength.periods.today",
    from() {
      let dateTimezone = getStartDateForChart();

      if (dateTimezone.getHours() < 17) {
        dateTimezone = subDays(dateTimezone, 1);
      }
      dateTimezone.setHours(17);

      return formatDatetime(dateTimezone);
    },
    to() {
      const fromDate = new Date(this.from());
      return formatDatetime(addDays(fromDate, 1));
    },
    step: 60,
    format: formatDatetimeChart,
  },
  yesterday: {
    title: "strength.periods.yesterday",
    btnTitle: "strength.periods.yesterday",
    from() {
      let dateTimezone = getStartDateForChart();

      if (dateTimezone.getHours() < 17) {
        dateTimezone = subDays(dateTimezone, 2);
      }
      dateTimezone.setHours(17);

      return formatDatetime(dateTimezone);
    },
    to() {
      const fromDate = new Date(this.from());
      return formatDatetime(addDays(fromDate, 1));
    },
    step: 60,
    format: formatDatetimeChart,
  },
  week: {
    title: "strength.periods.week",
    btnTitle: "strength.periods.week",
    from() {
      let dateTimezone = getStartDateForChart();

      if (dateTimezone.getHours() < 17) {
        dateTimezone = startOfWeek(dateTimezone);
      }
      dateTimezone.setHours(17);

      return formatDatetime(dateTimezone);
    },
    to() {
      let dateTimezone = getStartDateForChart();
      dateTimezone.setHours(17);

      return formatDatetime(dateTimezone);
    },
    step: 1440,
    format: formatDatetimeChart,
  },
  prevWeek: {
    title: "strength.periods.prevWeek",
    btnTitle: "strength.periods.prevWeek",
    from() {
      let dateTimezone = getStartDateForChart();

      if (dateTimezone.getHours() < 17) {
        dateTimezone = sub(startOfWeek(dateTimezone), {
          weeks: 1,
        });
      }
      dateTimezone.setHours(17);

      return formatDatetime(dateTimezone);
    },
    to() {
      const fromDate = new Date(this.from());
      return formatDatetime(
        add(fromDate, {
          weeks: 1,
        })
      );
    },
    step: 1440,
    format: formatDatetimeChart,
  },
  month: {
    title: "strength.periods.month",
    btnTitle: "strength.periods.month",
    from() {
      let dateTimezone = getStartDateForChart();

      if (dateTimezone.getHours() < 17) {
        dateTimezone = startOfMonth(dateTimezone);
      }
      dateTimezone.setHours(17);

      return formatDatetime(dateTimezone);
    },
    to() {
      let dateTimezone = getStartDateForChart();
      dateTimezone.setHours(17);

      return formatDatetime(dateTimezone);
    },
    step: 1440,
    format: formatDatetimeChart,
  },
};
