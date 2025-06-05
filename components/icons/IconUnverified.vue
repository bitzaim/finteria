<template>
  <!--  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">-->
  <svg v-bind="attrs" fill="none">
    <circle cx="7" cy="7.5" r="7" fill="#FB7C20" />
    <rect x="3" y="6.5" width="8" height="2" rx="1" fill="white" />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 14, height: 14 });
</script>
