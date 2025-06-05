<template>
  <Line
    ref="lineChart"
    :options="chartOptions"
    :data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :width="width"
    :height="height"
    :plugins="plugins"
  />
</template>

<script setup>
import { computed, watch } from "vue";
import { Line } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler,
} from "chart.js";
import dataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";
import sparkle from "/icons/sparkle.svg";
ChartJS.register(
  Title,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler,
  dataLabels,
  annotationPlugin
);
const emit = defineEmits(["predictEnd"]);
const props = defineProps({
  labelsVisible: {
    type: Boolean,
  },
  pair: {
    type: Object,
    required: true,
  },
  action: {
    type: String,
    default: null,
  },
  investment: {
    type: Number,
    default: 0,
  },
});
const items = ref([]);
const lineChart = ref(null);
const activeIntervalId = ref(null);
const chartId = "line-chart";
const datasetIdKey = "label";
const width = 428;
const height = 238;
const TICKING_PERIOD = 1300;
const plugins = [dataLabels, annotationPlugin];
const startPriceIndex = ref(null);
const endPriceIndex = ref(null);
const tickCount = ref(null);
const oppositeAction = computed(() => {
  if (props.action === "buy") {
    return "SELL";
  } else {
    return "BUY";
  }
});

const sparkleImage = document.createElement("img");
sparkleImage.setAttribute("src", sparkle);

const chartData = computed(() => {
  return {
    labels: items.value.map((item) => item),
    datasets: [
      {
        data: items.value.map((item) => item),
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 210);

          gradient.addColorStop(0.3, "#AFD2FB");
          gradient.addColorStop(1, "rgb(175, 210, 251, 0.1)");

          return gradient;
        },
        pointBackgroundColor: function (context) {
          if (props.action === "buy") {
            return context.dataIndex === startPriceIndex.value
              ? "#3ad2a0"
              : context.dataIndex === endPriceIndex.value
              ? "#f88"
              : "#3d81f5";
          } else if (props.action === "sell") {
            return context.dataIndex === startPriceIndex.value
              ? "#f88"
              : context.dataIndex === endPriceIndex.value
              ? "#3ad2a0"
              : "#3d81f5";
          } else {
            return "#3d81f5";
          }
        },
        fill: true,
        borderColor: "#E0F1FF",
        borderWidth: 0,
        hitRadius: 20,
        pointHoverRadius: 5,
        datalabels: {
          labels: {
            label: {
              display: (context) => {
                if (props.labelsVisible) {
                  return context.dataIndex === startPriceIndex.value || context.dataIndex === endPriceIndex.value;
                } else {
                  return false;
                }
              },
              formatter: (value, context) =>
                `${
                  context.dataIndex === startPriceIndex.value
                    ? `${props.action?.toUpperCase()} ${value}`
                    : `${oppositeAction.value} ${value}`
                }`,
              backgroundColor: (context) => {
                if (props.action === "buy") {
                  return context.dataIndex === startPriceIndex.value ? "#3ad2a0" : "#f88";
                } else {
                  return context.dataIndex === startPriceIndex.value ? "#f88" : "#3ad2a0";
                }
              },
              borderRadius: 6,
              color: "#222",
              padding: {
                top: 5,
                bottom: 4,
                left: 9,
                right: 9,
              },
              font: { weight: "normal", size: "14px" },
              textAlign: "center",
              align: (context) => `${context.dataIndex <= 6 ? "-320" : "130"}`,
              offset: 10,
            },
          },
        },
      },
    ],
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      y: {
        easing: "linear",
        type: "number",
        duration: 0,
      },
      y2: {
        easing: "linear",
        type: "number",
        duration: 0,
      },
      // 'x', 'y', 'x2', 'y2', 'width', 'height', 'centerX', 'centerY', 'pointX', 'pointY', 'radius'
    },
    elements: {
      point: {
        pointStyle: (ctx) => {
          return ctx.dataIndex === endPriceIndex.value ? sparkleImage : undefined;
        },
        pointRadius: (ctx) => {
          return ctx.dataIndex === endPriceIndex.value ? 13 : 6.5;
        },
        pointBorderWidth: (ctx) => {
          return ctx.dataIndex === endPriceIndex.value ? 0 : 4;
        },
      },
    },
    chartArea: {
      backgroundColor: "rgba(251, 85, 85, 0.4)",
    },
    scales: {
      y: {
        display: false,
        suggestedMin: Number(items.value?.[0]) * 0.97,
        suggestedMax: Number(items.value?.[0]) * 1,
      },
      x: {
        display: false,
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 30,
        bottom: 30,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: props.action
          ? [
              {
                type: "line",
                mode: "horizontal",
                // scaleID: "y-axis-2",
                yMin: 0,
                yMax: 0,
                borderDash: [5],
                borderColor: "#D1EAFF",
                borderWidth: 2,
                border: "dashed",
                label: {
                  enabled: false,
                  content: "Test label",
                },
                z: -100,
              },
            ]
          : [],
      },
    },
  };
});

function addData(chart, label, data) {
  // console.log(chart.options.scales.y.suggestedMax);
  // console.log(chart.options.scales.y.suggestedMin);
  //removing data
  chart?.data.labels.shift();
  chart?.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });

  // adding data
  chart?.data.labels.push(label);
  chart?.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });

  // shifting line annotation
  if (chart?.options.plugins.annotation.annotations[0]) {
    chart.options.plugins.annotation.annotations[0].yMin = data;
    chart.options.plugins.annotation.annotations[0].yMax = data;
  }
  // correcting Y-scale
  const attitude = Number(data) / chart?.options.scales.y.suggestedMin - 1;
  if (attitude < 0.3 && prevValueLate()) {
    chart.options.scales.y.suggestedMin = prevValueLate() * 0.97;
  }

  chart?.update();
}

const adjustmentComp = computed(() => {
  if (props.action === "buy") return 0.5;
  if (props.action === "sell") return -0.5;
  else return 0;
});

const prevValueEarly = computed(() => {
  if (items.value[items.value.length - 1]) {
    return items.value[items.value.length - 1];
  } else {
    return props.pair.price;
  }
});

const prevValueLate = () => {
  return lineChart?.value?.chart?.data?.datasets[0]?.data[lineChart.value.chart.data.datasets[0].data.length - 1];
};

function createItem({ times = 1 }) {
  const prevValue = lineChart?.value?.chart?.data?.datasets[0]?.data ? prevValueLate() : prevValueEarly.value;

  let adjustment = adjustmentComp.value;
  const attitude = props.pair.price / prevValue - 1;

  // AUTO-regulation of graphic price if shift will be more than 10%
  if (Math.abs(attitude) > 0.1 && !props.action) {
    adjustment = attitude * 6;
  }

  // console.log(props.action);
  for (let index = 0; index < times; index++) {
    const STEP = 0.006;
    const adjustedRandom = Math.random() * 2 - 1 + adjustment;
    const newValue = prevValue * (1 + STEP * adjustedRandom);
    // console.log(props.pair.numbersAfterDecimal);
    if (times === 1) {
      return newValue.toFixed(props.pair.numbersAfterDecimal);
    } else {
      items.value.push(newValue.toFixed(props.pair.numbersAfterDecimal));
    }
  }
}

// function calcProfit() {
//   const chart = lineChart.value?.chart;
//   if (!chart) {
//     return;
//   }
//   const startPrice = Number(chart.data.labels[startPriceIndex.value]);
//   const endPrice = Number(chart.data.labels[endPriceIndex.value]);
//   const attitude = Number(endPrice / startPrice - 1);
//   let profit = (attitude * props.investment * Number(props.pair.leverage)).toFixed(0);
//   if (props.action === "sell") profit = profit * -1;
//   return profit;
// }

function calcProfit() {
  const chart = lineChart.value?.chart;
  if (!chart) {
    return;
  }
  const startPrice = Number(chart.data.labels[startPriceIndex.value]);
  const endPrice = Number(chart.data.labels[endPriceIndex.value]);
  let profit = 0;
  if (props.action === "buy") {
    profit = startPrice <= endPrice ? Math.round(props.investment * 1.9) : -props.investment;
  } else if (props.action === "sell") {
    profit = startPrice >= endPrice ? Math.round(props.investment * 1.9) : -props.investment;
  }
  return profit;
}

onBeforeMount(() => {
  createItem({ times: 8 });

  activeIntervalId.value = setInterval(Ticking, TICKING_PERIOD);
});

function Ticking() {
  if (props.action && !tickCount.value) {
    startPriceIndex.value = 7;
    endPriceIndex.value = 13;
  }

  if (props.action) {
    tickCount.value++;
    startPriceIndex.value--;
    endPriceIndex.value--;
  }

  if (tickCount.value === 6) {
    clearInterval(activeIntervalId.value);
    emit("predictEnd", calcProfit());
  }
  const newVal = createItem({ times: 1 });
  addData(lineChart.value?.chart, newVal, newVal);
}

watch(
  () => props.pair,
  (newPair) => {
    tickCount.value = null;
    startPriceIndex.value = null;
    endPriceIndex.value = null;
    clearInterval(activeIntervalId.value);
    activeIntervalId.value = null;
    items.value = [];
    lineChart.value.chart.data.datasets[0].data = null;
    createItem({ times: 8 });

    activeIntervalId.value = setInterval(Ticking, TICKING_PERIOD);
  }
);
</script>
