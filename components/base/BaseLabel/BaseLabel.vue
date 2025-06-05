<template>
  <label :for="forValue" class="label" :class="{ label_small: small }">
    <slot />
  </label>
</template>

<script setup lang="ts">
import { Props } from "./BaseLabel.type";

withDefaults(defineProps<Props>(), {
  small: false,
});
</script>

<style scoped lang="scss">
.label {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    margin-bottom: 14px;
    font-size: 24px;
  }
}

.label_small {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    margin-bottom: 14px;
    font-size: 14px;
    line-height: 1.45;
  }
}
</style>
