<template>
  <svg v-bind="attrs" fill="none">
    <path
      d="M1.5 5.16671L6 9.66671L14.3333 1.33337"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 16, height: 11 });
</script>
