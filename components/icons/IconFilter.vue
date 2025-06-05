<template>
  <svg v-bind="attrs" fill="none">
    <line x1="3" y1="5.5" x2="15" y2="5.5" stroke="#4785EF" />
    <line x1="5" y1="5.5" x2="8" y2="5.5" stroke="#4785EF" stroke-width="3" />
    <line x1="10" y1="9.5" x2="13" y2="9.5" stroke="#4785EF" stroke-width="3" />
    <line x1="5" y1="13.5" x2="8" y2="13.5" stroke="#4785EF" stroke-width="3" />
    <line x1="3" y1="9.5" x2="15" y2="9.5" stroke="#4785EF" />
    <line x1="3" y1="13.5" x2="15" y2="13.5" stroke="#4785EF" />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 20, height: 20 });
</script>
