import { Pair } from "./calculator.type";

export type SelectAssetProps = {
  pair: Pair;
  pairs?: Pair[];
  disabled: boolean;
};

export type SelectAssetEmits = {
  (evt: "change", item: Pair): void;
};

export type TopSubStrategy = {
  account: number;
  id: number;
  next_trade: string;
  sumbols_name: string[];
  trade_interval: string;
  up_probability: number;
};

export type TopStrategy = {
  account: number;
  country: string;
  description: string;
  id: number;
  performance: string | number;
  pseudo: string;
  social: string;
  strategies: TopSubStrategy[];
  trades_per_week: number;
  type: string;
};
