<template>
  <NuxtLayout name="top-background">
    <section class="intro">
      <div class="container">
        <h1 class="title title_without-border">{{ $t("strength.currency.title") }}</h1>

        <p class="intro__lead">{{ $t("strength.currency.lead") }}</p>
      </div>
    </section>

    <section class="chart">
      <div class="container">
        <LineChart
          class="chart__view"
          :data="chartData"
          :options="chartOptions"
          :periods="periods"
          :active-period="activePeriod"
          :loading="chartPending"
          @change-period="updateChartData"
        />
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { getCurrencyStrength } from "@/services/tools";
import { LINE_CHART_OPTIONS, PERIODS_LIST, PERIODS_DATETIME_LIST, SYMBOL_COLOR_MAP } from "@/constants/tools";
import { PeriodType, PeriodDatetimeItem, PeriodItem, PeriodsMap } from "@/types/tools.type";

import LineChart from "@/components/tools/LineChart.vue";

const { t, locale } = useI18n();

const activePeriod = ref<string>("24h");
const activeType = ref<string>("period");

const activeListItem = computed<PeriodItem | PeriodDatetimeItem>(() => {
  return activeType.value === "period" ? PERIODS_LIST[activePeriod.value] : PERIODS_DATETIME_LIST[activePeriod.value];
});

const chartPeriodInMinutes = computed<number>(() => {
  return activeType.value === "period" ? PERIODS_LIST[activePeriod.value].minutes : 0;
});

const chartStepInMinutes = computed<number>(() => {
  return activeType.value === "period"
    ? PERIODS_LIST[activePeriod.value].step
    : PERIODS_DATETIME_LIST[activePeriod.value].step;
});

const periods = computed<PeriodsMap>(() => {
  return {
    periods: PERIODS_LIST,
    datetimes: PERIODS_DATETIME_LIST,
  };
});

const {
  data: chartData,
  refresh: refreshChartData,
  pending: chartPending,
} = useAsyncData(
  "currencyStrength",
  () => {
    return getCurrencyStrength({
      period: activeType.value === "period" ? chartPeriodInMinutes.value : undefined,
      from_datetime: activeType.value === "datetime" ? PERIODS_DATETIME_LIST[activePeriod.value].from() : undefined,
      to_datetime: activeType.value === "datetime" ? PERIODS_DATETIME_LIST[activePeriod.value].to() : undefined,
      step: chartStepInMinutes.value,
    });
  },
  {
    transform: (data) => {
      const firstKey = Object.keys(data)[0];
      const periodLabels = data[firstKey].map((periodItem) => {
        return activeListItem.value.format(periodItem.datetime, locale.value);
      });

      const datasets = [];

      for (let key in data) {
        datasets.push({
          label: key,
          borderColor: SYMBOL_COLOR_MAP[key] || "#f87979",
          backgroundColor: SYMBOL_COLOR_MAP[key] || "#f87979",
          data: data[key].map((periodItem) => Number(periodItem.percent_change)),
          pointRadius: 0,
          pointBorderWidth: 0,
          tension: 0.3,
        });
      }

      const sortedDatasets = datasets.sort((a, b) => {
        const num1 = a.data[a.data.length - 1];
        const num2 = b.data[b.data.length - 1];

        if (num1 > num2) {
          return -1;
        }

        if (num1 < num2) {
          return 1;
        }

        return 0;
      });

      return {
        labels: periodLabels,
        datasets: sortedDatasets,
      };
    },
  }
);

const chartOptions = reactive(LINE_CHART_OPTIONS);
if (chartOptions.plugins?.title) {
  chartOptions.plugins.title.text = t(activeListItem.value.title);
}

const updateChartData = (data: { type: PeriodType; value: string }) => {
  activePeriod.value = data.value;
  activeType.value = data.type;

  if (chartOptions.plugins?.title) {
    chartOptions.plugins.title.text =
      data.type === "period"
        ? t(PERIODS_LIST[activePeriod.value].title)
        : t(PERIODS_DATETIME_LIST[activePeriod.value].title);
  }
  refreshChartData();
};
</script>

<style scoped lang="scss">
.intro__lead {
  margin: 40px 0 30px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}
</style>
