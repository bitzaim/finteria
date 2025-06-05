<template>
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#4785EF" />
    <path
      d="M20 8C18.8954 8 18 8.89543 18 10V24.75C18 25.8546 18.8954 26.75 20 26.75C21.1046 26.75 22 25.8546 22 24.75V10C22 8.89543 21.1046 8 20 8ZM19.9271 29.1458C18.8628 29.1458 18 30.0086 18 31.0729C18 32.1372 18.8628 33 19.9271 33H20.0729C21.1372 33 22 32.1372 22 31.0729C22 30.0086 21.1372 29.1458 20.0729 29.1458H19.9271Z"
      fill="white"
    />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 40, height: 40 });
</script>
