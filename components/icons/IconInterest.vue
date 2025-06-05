<template>
  <svg v-bind="attrs">
    <path
      d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm0 18.182A8.181 8.181 0 1 1 20.182 12 8.191 8.191 0 0 1 12 20.182Z"
    />
    <path
      d="M16.28 7.72a.91.91 0 0 0-1.286 0L7.72 14.995a.91.91 0 1 0 1.285 1.285l7.273-7.273a.91.91 0 0 0 0-1.285ZM8.818 10.636a1.818 1.818 0 1 0 0-3.636 1.818 1.818 0 0 0 0 3.636ZM15.182 17a1.818 1.818 0 1 0 0-3.636 1.818 1.818 0 0 0 0 3.636Z"
    />
  </svg>
</template>

<script>
export default {
  name: "IconInterest",
};
</script>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 24, height: 24 });
</script>
