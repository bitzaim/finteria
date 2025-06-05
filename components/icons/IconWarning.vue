<template>
  <svg v-bind="attrs">
    <path
      d="M15.3486 5.00814C16.4754 2.87969 19.5245 2.87968 20.6514 5.00813L33.6686 29.5963C34.7264 31.5943 33.278 34 31.0173 34H4.98271C2.72199 34 1.27358 31.5943 2.33135 29.5963L15.3486 5.00814Z"
      fill="#FBC920"
    />
    <rect x="16" y="12" width="4" height="12" fill="white" />
    <rect x="16" y="26" width="4" height="4" fill="white" />
  </svg>
</template>

<script>
export default {
  name: "IconWindows",
};
</script>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 36, height: 36 });
</script>
