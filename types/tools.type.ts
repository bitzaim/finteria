export type PeriodType = "period" | "datetime";

export type PeriodItem = {
  title: string;
  minutes: number;
  step: number;
  format: (date: Date | string, locale?: string) => string;
};

export type PeriodDatetimeItem = Omit<PeriodItem, "minutes"> & {
  btnTitle: string;
  from: () => string;
  to: () => string;
  format: (date: Date | string, locale?: string) => string;
};

export type PeriodsList = {
  [key: string]: PeriodItem;
};

export type PeriodsDatetimeList = {
  [key: string]: PeriodDatetimeItem;
};

export type PeriodsMap = {
  periods: PeriodsList;
  datetimes: PeriodsDatetimeList;
};
