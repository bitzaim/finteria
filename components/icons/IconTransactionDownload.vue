<template>
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!--  <svg v-bind="attrs" fill="none">-->
    <path
      d="M45.5 32.5V41.1667C45.5 42.3159 45.0435 43.4181 44.2308 44.2308C43.4181 45.0435 42.3159 45.5 41.1667 45.5H10.8333C9.68406 45.5 8.58186 45.0435 7.7692 44.2308C6.95655 43.4181 6.5 42.3159 6.5 41.1667V32.5"
      stroke="#E9BB1E"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15.168 21.6666L26.0013 32.5L36.8346 21.6666"
      stroke="#E9BB1E"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M26 32.5V6.5" stroke="#E9BB1E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 52, height: 52 });
</script>
