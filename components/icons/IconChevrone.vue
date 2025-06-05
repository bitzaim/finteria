<template>
  <svg v-bind="attrs">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.21967 0.814396C0.512563 0.521503 0.987437 0.521503 1.28033 0.814396L4.75 4.28407L8.21967 0.814396C8.51256 0.521503 8.98744 0.521503 9.28033 0.814396C9.57322 1.10729 9.57322 1.58216 9.28033 1.87506L4.75 6.40539L0.21967 1.87506C-0.0732233 1.58216 -0.0732233 1.10729 0.21967 0.814396Z"
    />
  </svg>
</template>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 10, height: 7 });
</script>
