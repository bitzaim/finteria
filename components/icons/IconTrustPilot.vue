<template>
  <svg v-bind="attrs">
    <path
      d="M40 15.2855H24.7182L20.0139 0L15.2818 15.2855L0 15.2562L12.3591 24.7145L7.627 40L19.9861 30.5417L32.3452 40L27.6409 24.7145L40 15.2855Z"
      fill="#00B67A"
    />
    <path d="M28.6984 28.1702L27.6407 24.7148L20.0137 30.5421L28.6984 28.1702Z" fill="#005128" />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 40, height: 40 });
</script>
