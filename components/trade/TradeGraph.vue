<template>
  <Line
    :data="chartData"
    :options="chartOptions"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
    :plugins="plugins"
  />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";

import { Chart as ChartJS, Title, Legend, LineElement, LinearScale, PointElement, CategoryScale } from "chart.js";

import dataLabels from "chartjs-plugin-datalabels";

ChartJS?.register(Title, Legend, LineElement, LinearScale, PointElement, CategoryScale, dataLabels);

const props = defineProps<{ items: any }>();

const chartId = "line-chart";
const datasetIdKey = "label";
const width = 400;
const height = 200;
const cssClasses = "";
const styles = {};
const plugin = {
  id: "custom_canvas_background_color",
  beforeDraw: (chart) => {
    const ctx = chart.canvas.getContext("2d");
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    const my_gradient = ctx.createLinearGradient(chart.width / 2, 0, chart.width / 2, chart.height);
    my_gradient.addColorStop(0, "#4785EF");
    my_gradient.addColorStop(1, "#D5E3FB");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};
const plugins = [dataLabels, plugin];

const labels = props.items.map((item) => item.close);
const chartData: any = {
  labels: labels,
  datasets: [
    {
      label: "Course (USD)",
      data: labels,
      fill: false,
      borderColor: "#fff",
      backgroundColor: "#FBC920",
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 4,
      datalabels: {
        labels: {
          label: {
            formatter: (value, context) => `${context.dataIndex === 0 ? "BUY" : "SELL"}`,
            backgroundColor: "#fff",
            borderRadius: 4,
            color: "#FB7C20",
            font: { weight: "bold", size: "12px" },
            textAlign: "center",
            display: (context) => context.dataIndex === 0 || context.dataIndex === context.dataset.data.length - 1,
            align: "top",
            offset: 11,
          },
          count: {
            formatter: (value) => `${value}`,
            backgroundColor: "#fff",
            borderRadius: 4,
            color: "#FB7C20",
            font: { weight: "bold", size: "11px" },
            textAlign: "center",
            display: (context) => context.dataIndex === 0 || context.dataIndex === context.dataset.data.length - 1,
            align: "bottom",
            offset: 11,
          },
        },
      },
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      backdropColor: "green",
      ticks: {
        display: false,
      },
      grid: {
        display: false,
        color: "rgba(255, 255, 255, 0.2)",
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
    },
    x: {
      ticks: {
        display: false,
      },
      grid: {
        drawBorder: false,
        color: "rgba(255, 255, 255, 0.2)",
      },
    },
  },
  layout: {
    padding: {
      left: 30,
      right: 30,
      top: 35,
      bottom: 35,
    },
  },
  plugins: { legend: { display: false } },
};
</script>
