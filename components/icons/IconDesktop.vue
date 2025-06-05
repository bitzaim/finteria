<template>
  <svg v-bind="attrs">
    <path
      d="M20 19a1.99 1.99 0 0 0 1.99-2L22 6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H0a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2h-4ZM4 6h16v11H4V6Zm8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1Z"
    />
  </svg>
</template>

<script>
export default {
  name: "IconDesktop",
};
</script>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 24, height: 24 });
</script>
