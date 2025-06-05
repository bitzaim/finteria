<template>
  <div
    class="ui-card"
    :class="{
      'ui-card_in-content': inContent,
    }"
    :style="`background: ${background}`"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Props } from "./BaseCard.type";

withDefaults(defineProps<Props>(), {
  background: "#ffffff",
  inContent: false,
});
</script>

<style scoped lang="scss">
@import "@/assets/style/include.scss";

.ui-card {
  padding: 30px 20px;

  @include media-breakpoint-up("md") {
    padding: 60px;
  }
}

.ui-card_in-content {
  padding: 20px 15px;

  @include media-breakpoint-up("sm") {
    padding: 30px 20px;
  }

  @include media-breakpoint-up("md") {
    padding: 30px;
  }
}
</style>
