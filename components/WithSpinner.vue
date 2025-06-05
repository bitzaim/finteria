<template>
  <div>
    <BaseLoader v-if="isFetching" :inline="inline" />

    <slot v-else />
  </div>
</template>

<script setup>
import BaseLoader from "./base/BaseLoader/BaseLoader.vue";

defineProps({
  isFetching: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
});
</script>
