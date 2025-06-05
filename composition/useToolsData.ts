import type { Tool } from "@/services/types/tools.type";
import { getLastDayPrices, getLastPrices, getSymbolsList } from "@/services/tools";
import { getAdaptedToolsData } from "@/utils/tools";

export const useToolsData = () => {
  const toolsData = ref<Tool[]>([]);

  const getToolsData = async (type?: string) => {
    const [{ data: symbols }, { data: lastPrices }, { data: lastDayPrices }] = await Promise.all([
      useAsyncData("symbols", () => getSymbolsList()),
      useAsyncData("lastPrices", () => getLastPrices()),
      useAsyncData("lastDayPrices", () => getLastDayPrices()),
    ]);

    if (symbols.value) {
      toolsData.value = type
        ? getAdaptedToolsData(symbols.value, lastPrices.value, lastDayPrices.value, type)
        : getAdaptedToolsData(symbols.value, lastPrices.value, lastDayPrices.value);
    }
  };

  return {
    toolsData,
    getToolsData,
  };
};
