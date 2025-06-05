<template>
  <svg v-bind="attrs">
    <path
      d="M19.494 0H7.948a1.997 1.997 0 0 0-1.997 1.999v23.446c0 1.102.892 1.997 1.997 1.997h11.546a1.998 1.998 0 0 0 1.997-1.997V1.999A1.999 1.999 0 0 0 19.494 0zm-8.622 1.214h5.7c.144 0 .261.215.261.481s-.117.482-.261.482h-5.7c-.145 0-.26-.216-.26-.482s.115-.481.26-.481zm2.85 24.255a1.275 1.275 0 1 1 0-2.55 1.275 1.275 0 0 1 0 2.55zm6.273-4.369H7.448V3.373h12.547V21.1z"
    />
  </svg>
</template>

<script>
export default {
  name: "IconMobile",
};
</script>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 27.442, height: 27.442 });
</script>
