<template>
  <svg v-bind="attrs" fill="none">
    <path
      d="M17 9.5C17 13.8999 13.4 17.5 9 17.5M17 9.5C17 5.10007 13.4 1.5 9 1.5M17 9.5H1M9 17.5C4.60003 17.5 1 13.8999 1 9.5M9 17.5V1.5M9 17.5C11.2 17.5 12.9834 13.8999 12.9834 9.5C12.9834 5.10007 11.2 1.5 9 1.5M9 17.5C6.80003 17.5 5.0166 13.8999 5.0166 9.5C5.0166 5.10007 6.80003 1.5 9 1.5M1 9.5C1 5.10007 4.60003 1.5 9 1.5M15.5879 5.01867H2.41212M15.5879 13.9813H2.41212"
      stroke="#5D94F1"
      stroke-width="1.5"
      stroke-miterlimit="10"
    />
  </svg>
</template>
<script setup lang="ts">
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 18, height: 19 });
</script>
