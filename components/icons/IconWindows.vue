<template>
  <svg v-bind="attrs">
    <path
      d="M1 4.4258L7.95189 3.47489V10.1701H1M8.78923 3.33904L18 2V10.1119H8.78923M1 10.8765H7.95189V17.5911L1 16.6208M8.78923 10.9658H18V19L8.78923 17.6998"
      fill="#5D94F1"
    />
  </svg>
</template>

<script>
export default {
  name: "IconWindows",
};
</script>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 20, height: 19 });
</script>
