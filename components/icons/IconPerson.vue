<template>
  <svg v-bind="attrs" fill="none">
    <path
      d="M33.3327 35V31.6667C33.3327 29.8986 32.6303 28.2029 31.3801 26.9526C30.1298 25.7024 28.4341 25 26.666 25H13.3327C11.5646 25 9.86888 25.7024 8.61864 26.9526C7.36839 28.2029 6.66602 29.8986 6.66602 31.6667V35"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20.0007 18.3333C23.6825 18.3333 26.6673 15.3486 26.6673 11.6667C26.6673 7.98477 23.6825 5 20.0007 5C16.3188 5 13.334 7.98477 13.334 11.6667C13.334 15.3486 16.3188 18.3333 20.0007 18.3333Z"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 40, height: 40 });
</script>
