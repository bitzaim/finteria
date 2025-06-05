<template>
  <svg v-bind="attrs">
    <path
      d="M.318 15.682a1.086 1.086 0 0 0 1.537 0L8 9.536l6.146 6.146a1.086 1.086 0 0 0 1.536-1.537L9.536 8l6.146-6.145A1.086 1.086 0 0 0 14.145.318L8 6.463 1.855.318A1.086 1.086 0 1 0 .319 1.855L6.464 8 .318 14.146a1.086 1.086 0 0 0 0 1.536Z"
    />
  </svg>
</template>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 16, height: 16 });
</script>
