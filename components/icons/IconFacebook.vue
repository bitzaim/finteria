<template>
  <svg v-bind="attrs">
    <path
      d="M5.88551 2.61756H7.2V0.327963C6.97322 0.296763 6.19328 0.226562 5.28496 0.226562C3.38972 0.226562 2.09143 1.41876 2.09143 3.60996V5.62656H0V8.18616H2.09143V14.6266H4.65561V8.18676H6.66245L6.98102 5.62716H4.65501V3.86376C4.65561 3.12396 4.8548 2.61756 5.88551 2.61756Z"
    />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 7, height: 15 });
</script>
