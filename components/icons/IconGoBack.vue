<template>
  <!--  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">-->
  <svg v-bind="attrs" fill="none">
    <path
      d="M6.77734 8.5H4.37778V6.71354H6.77734C7.58505 6.71354 8.24218 6.0457 8.24218 5.22483C8.24218 4.40395 7.58505 3.73611 6.77734 3.73611H3.45702V5.18576L0 2.84288L3.45702 0.5V1.94965H6.77734C8.55431 1.94965 10 3.41889 10 5.22483C10 7.03076 8.55431 8.5 6.77734 8.5Z"
      fill="#4785EF"
    />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 10, height: 8 });
</script>
