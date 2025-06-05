import type { TopStrategy } from "@/types/trade.type";

export type SignalProvidersOutDto = {
  page: number;
  page_size: number;
  results: TopStrategy[];
  total: number;
};
