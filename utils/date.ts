import { format, Locale } from "date-fns";
import { fr, es, it, pt, pl, tr, ja, zhCN, ru, uk } from "date-fns/esm/locale";

const LOCALES_MAP: {
  [key: string]: Locale;
} = {
  fr: fr,
  es: es,
  it: it,
  pt: pt,
  pl: pl,
  tr: tr,
  ja: ja,
  zh: zhCN,
  ru: ru,
  uk: uk,
};

const SHORT_DATE_FORMAT_DEFAULT = "dd LLL • yyyy";
const SHORT_DATE_FORMAT_EN = "LLL dd • yyyy";
const SHORT_DATE_FORMAT_ASIA = "yo MMM do";
const SHORT_TIME_FORMAT = "HH:mm";
const STANDART_DATE_FORMAT = "dd.MM.yy";
const CHART_DATETIME_FORMAT = "dd.MM.yyyy HH:mm";
const STANDART_DATE_FORMAT_ASIA = "yo MM do";
const CHART_DATETIME_FORMAT_ASIA = "yo MM do HH:mm";
const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
const SPECIAL_DATE_FORMAT = "yyy-MM-dd";

const formatDateShort = (date: Date | string, locale: string = "en"): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  switch (locale) {
    case "en":
      return format(date, SHORT_DATE_FORMAT_EN);
    case "ja":
    case "zh":
      return format(date, SHORT_DATE_FORMAT_ASIA, { locale: LOCALES_MAP[locale] });
    default:
      return format(date, SHORT_DATE_FORMAT_DEFAULT, {
        locale: LOCALES_MAP[locale],
      });
  }
};

const formatDateShortTime = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return format(date, SHORT_TIME_FORMAT);
};

const formatDateStandart = (date: Date | string, locale: string = "en"): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  switch (locale) {
    case "ja":
    case "zh":
      return format(date, STANDART_DATE_FORMAT_ASIA, { locale: LOCALES_MAP[locale] });
    default:
      return format(date, STANDART_DATE_FORMAT);
  }
};

const formatDatetimeChart = (date: Date | string, locale: string = "en"): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  switch (locale) {
    case "ja":
    case "zh":
      return format(date, CHART_DATETIME_FORMAT_ASIA, { locale: LOCALES_MAP[locale] });
    default:
      return format(date, CHART_DATETIME_FORMAT);
  }
};

const formatDatetime = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return format(date, DATETIME_FORMAT);
};

const formatDateSpecial = (date: Date | string, locale: string = "en"): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return format(date, SPECIAL_DATE_FORMAT);
};

export {
  formatDateShort,
  formatDateShortTime,
  formatDateStandart,
  formatDatetime,
  formatDatetimeChart,
  formatDateSpecial,
};
