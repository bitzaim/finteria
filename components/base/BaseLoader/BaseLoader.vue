<template>
  <div v-bind="$attrs" class="spinner" :class="{ spinner_inline: inline }">
    <b
      class="spinner__text"
      :class="{
        'visually-hidden': !withText,
      }"
    >
      {{ loadingText || $t("common.btns.waiting") }}
    </b>

    <div
      class="spinner__circle"
      :class="{
        spinner__circle_inline: inline,
        spinner__circle_primary: primary,
      }"
    >
      <div class="spinner__ring"></div>
      <div class="spinner__back"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Props } from "./BaseLoader.type";

withDefaults(defineProps<Props>(), {
  inline: false,
  primary: false,
  withText: false,
});
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";
.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spinner-padding;
  margin: auto;
}
.spinner_inline {
  display: inline-flex;
  flex-direction: row;
  padding: 0;
}

.spinner__circle {
  position: relative;
  width: $spinner-circle-size;
  height: $spinner-circle-size;
  margin-bottom: 20px;
}

.spinner__circle_inline {
  box-sizing: border-box;
  width: $spinner-circle-size_inline;
  height: $spinner-circle-size_inline;
  margin: 0;
}

.spinner__ring {
  position: absolute;
  z-index: 4;
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0px;
  border: 2px solid;
  border-color: rgba($color-white, 80%) transparent transparent transparent;
  border-radius: 50%;
  animation: spinner__circle 1.2s linear infinite;
}

.spinner__back {
  position: absolute;
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0px;
  border: 2px solid;
  border-color: rgba($color-orange-darkest, 100%);
  border-radius: 50%;
}

.spinner__circle_primary .spinner__ring {
  border-color: rgba($color-white, 80%) transparent transparent transparent;
}

.spinner__circle_primary .spinner__back {
  border-color: rgba($color-primary, 100%);
}

.spinner__text {
  margin-right: 10px;
}

@keyframes spinner__circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
