<template>
  <svg v-bind="attrs" fill="none">
    <path
      d="M18.6673 19.5V17.8333C18.6673 16.9493 18.3161 16.1014 17.691 15.4763C17.0659 14.8512 16.218 14.5 15.334 14.5H8.66732C7.78326 14.5 6.93542 14.8512 6.31029 15.4763C5.68517 16.1014 5.33398 16.9493 5.33398 17.8333V19.5"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.9993 11.1667C13.8403 11.1667 15.3327 9.67428 15.3327 7.83333C15.3327 5.99238 13.8403 4.5 11.9993 4.5C10.1584 4.5 8.66602 5.99238 8.66602 7.83333C8.66602 9.67428 10.1584 11.1667 11.9993 11.1667Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 24, height: 24 });
</script>
