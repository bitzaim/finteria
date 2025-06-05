<template>
  <div
    class="line-chart"
    :class="{
      'line-chart_loading': loading,
    }"
  >
    <div class="line-chart__wrapper">
      <Line v-if="data" class="line-chart__chart" :data="data" :options="resultOptions" />

      <BaseLoader v-if="loading" class="line-chart__loader" />
    </div>

    <ul class="line-chart__btn-group">
      <li v-for="(_value, key) in periods.periods" :key="key" class="line-chart__btn-item">
        <button
          class="button button_outline button_small"
          :class="{
            button_yellow: activePeriod === key,
          }"
          type="button"
          @click="onChangePeriod('period', String(key))"
        >
          {{ String(key).toUpperCase() }}
        </button>
      </li>

      <li v-for="(value, key) in periods.datetimes" :key="key" class="line-chart__btn-item">
        <button
          class="button button_outline button_small"
          :class="{
            button_yellow: activePeriod === key,
          }"
          type="button"
          @click="onChangePeriod('datetime', String(key))"
        >
          {{ $t(value.btnTitle).toUpperCase() }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { PeriodType, PeriodsMap } from "@/types/tools.type";
import { Line } from "vue-chartjs";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartData,
} from "chart.js";
import { ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import { useWindowSize } from '@vueuse/core'

Chart.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, ChartDataLabels);

const props = withDefaults(
  defineProps<{
    data: ChartData<"line"> | null;
    options: ChartOptions<"line">;
    periods: PeriodsMap;
    activePeriod: string;
    loading?: boolean;
  }>(),
  {
    loading: false,
  }
);

const emit = defineEmits(["changePeriod"]);

const { width } = useWindowSize()

const onChangePeriod = (type: PeriodType, newPeriod: string) => {
  emit("changePeriod", {
    type,
    value: newPeriod,
  });
};

const resultOptions = computed(() => {
  const result = {
    ...props.options,
    scales: {
      x: {
        ticks: {
          display: width.value >= 768
        }
      },

      y: {
        ticks: {
          display: width.value >= 768
        }
      },
    },

    responsive: true,
    maintainAspectRatio: false
  }

  if (width.value < 768) {
    result.plugins.legend.position = 'bottom'
    result.plugins.datalabels.offset = -30
  }

  return result
})
</script>

<style scoped lang="scss">
.line-chart__wrapper {
  position: relative;
  height: 645px;

  @include media-breakpoint-down("xl") {
    height: 550px;
  }

  @include media-breakpoint-down("lg") {
    height: 450px;
  }

  @include media-breakpoint-down("md") {
    height: 350px;
  }
}

.line-chart_loading .line-chart__wrapper:before {
  position: absolute;
  width: 100%;
  height: 100%;
  content: "";
  background-color: $color-transparent-middle;
}

.line-chart__btn-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 960px;
  padding: 0;
  margin: 20px auto;
  list-style: none;
}

.line-chart__btn-item {
  padding: 5px;
}

.line-chart__loader-wrapper {
  position: relative;
  width: 100%;
  height: 645px;
}

.line-chart__loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>
