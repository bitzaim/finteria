<template>
  <NuxtLayout name="top-background">
    <div class="tool-page">
      <section class="intro">
        <div class="container">
          <h1 class="title title_without-border">
            {{ percentageWidgetData?.perfomance.symbol }} {{ $t("markets.title") }}
          </h1>

          <PercentageWidget v-if="percentageWidgetData" :data="percentageWidgetData" />
        </div>
      </section>

      <section class="price-chart">
        <div class="container price-chart__container">
          <h2 class="title title_border-after price-chart__title">
            {{ percentageWidgetData?.perfomance.symbol }} {{ $t("markets.chartTitle") }}
          </h2>

          <iframe class="price-chart__frame" :src="platformChartURL" width="100%" height="100%" />
          <MarketWatch
            class="price-chart__market-watch"
            :tabs="marketWatchTabs"
            :active-tool-type="currentSymbolData?.type"
          >
            {{ $t("markets.marketWatchTitle") }}
          </MarketWatch>

          <p class="price-chart__text">
            {{ $t("markets.chartText") }}
          </p>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import PercentageWidget from "@/components/tools/PercentageWidget.vue";
import MarketWatch from "@/components/tools/MarketWatch.vue";

import { getPerfomanceInfo } from "@/services/tools";
import { useToolsData } from "@/composition/useToolsData";
import { getTickerCapitalize } from "@/utils/tools";
import { MarketWatchTab, MarketWatchToolData, Tool, ToolWithPerfomance } from "@/services/types/tools.type";
import { useDomain } from "@/composition/useDomain";

const route = useRoute();
const currentSymbol = String(route.params.slug);
const currentSymbolInTickerFormat = getTickerCapitalize(currentSymbol);

const { t } = useI18n();

const { toolsData, getToolsData } = useToolsData();
await getToolsData();

const currentSymbolData: Tool | undefined = toolsData.value?.find(
  (item) => item.ticker === currentSymbolInTickerFormat
);

const { data: percentageWidgetData } = await useAsyncData(
  "percentageData",
  () => {
    return getPerfomanceInfo(currentSymbol);
  },
  {
    transform: (data): ToolWithPerfomance => {
      return {
        tool: currentSymbolData,
        perfomance: data,
      };
    },
  }
);

useHead({
  title: `${percentageWidgetData.value?.perfomance.symbol} ${t("markets.title")}`,
  meta: [
    {
      name: "description",
      content: t("markets.title"),
    },
  ],
});

const { optionsPlatformURL } = useDomain()

const platformChartURL = computed<string>(() => {
  return `${optionsPlatformURL.value}tv-chart?symbol=${currentSymbolInTickerFormat}&resolution=1h`;
});

const marketWatchTabs = computed<MarketWatchTab[]>(() => {
  const cryptoData: MarketWatchToolData[] = [];
  const forexData: MarketWatchToolData[] = [];

  toolsData.value?.forEach((item) => {
    const transformedItem = {
      ticker: item.ticker,
      ticker_with_slash: item.ticker_with_slash,
      type: item.type,
      price: item.price,
      difference_price: item.difference_price,
      difference_percentage: item.difference_percentage,
    };

    if (item.type === "forex") {
      forexData.push(transformedItem);
    }

    cryptoData.push(transformedItem);
  });

  return [
    {
      slug: "crypto",
      title: "Crypto",
      data: cryptoData,
    },
    {
      slug: "forex",
      title: "Forex",
      data: forexData,
    },
  ];
});
</script>

<style scoped lang="scss">
.tool-page {
  padding-bottom: 120px;

  @include media-breakpoint-up("md") {
    padding-bottom: 120px;
  }
}

.intro__percentage-widget {
  margin-top: 40px;

  @include media-breakpoint-up("md") {
    margin-top: 60px;
  }
}

.price-chart {
  margin-top: 60px;

  @include media-breakpoint-up("md") {
    margin-top: 120px;
  }
}

.price-chart__container {
  @include media-breakpoint-up("xxl") {
    display: grid;
    grid-template-columns: 850px 410px;
    row-gap: 40px;
    justify-content: space-between;
  }
}

.price-chart__title {
  @include media-breakpoint-up("xxl") {
    grid-column: 1 / 3;
  }
}

.price-chart__market-watch {
  margin-top: 30px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }

  @include media-breakpoint-up("xxl") {
    margin-top: 0;
  }
}

.price-chart__text {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }

  @include media-breakpoint-up("xxl") {
    grid-column: 1 / 3;
    max-width: 1068px;
    margin-top: 0;
  }
}

.price-chart__frame {
  min-height: 226px;

  @include media-breakpoint-up("sm") {
    min-height: 466px;
  }

  @include media-breakpoint-up("lg") {
    min-height: 625px;
  }

  @include media-breakpoint-up("xl") {
    min-height: 565px;
  }
}
</style>
