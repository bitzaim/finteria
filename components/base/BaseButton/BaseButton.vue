<template>
  <component
    :is="buttonComponent"
    class="btn"
    :class="{
      [`btn_${props.color}`]: true,
      [`btn_${props.size}`]: true,
      'btn_full-width': props.fullWidth,
      'btn_mobile-full-width': props.mobileFullWidth,
    }"
    :disabled="disabled"
    :to="to"
  >
    <span v-if="isLoading" class="btn__loader">
      {{ loadingText || $t("common.btns.loading") }} <IconLoading class="btn__loader-icon" />
    </span>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import type { Props } from "./BaseButton.type";
import type { ConcreteComponent } from "vue";
import IconLoading from "@/components/icons/IconLoading.vue";

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  size: "default",
  fullWidth: false,
  mobileFullWidth: false,
  isLoading: false,
  link: false,
});

const buttonComponent = computed<ConcreteComponent | string>(() => {
  return props.link ? resolveComponent("NuxtLink") : "button";
});
</script>

<style lang="scss" scoped>
.btn {
  box-sizing: border-box;
  display: inline-block;
  padding: 7px 12px 8px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 2px;
  transition: background-color $transition-time, border-color $transition-time;

  @include media-breakpoint-up("md") {
    padding: 10px 15px;
    font-size: 14px;
    line-height: 1.45;
  }
}

.btn_primary {
  color: $color-btn-primary;
  background-color: $color-btn-bg-primary;
}

.btn_secondary,
.btn_tertiary {
  color: $color-primary;
  background-color: $color-btn-bg-secondary;
}

.btn_secondary {
  border-color: $color-btn-bg-primary;
}

.btn_tertiary {
  padding: 8px 13px 9px;
  border-color: $color-disable-light;
  border-width: 1px;

  @include media-breakpoint-up("md") {
    padding: 11px 16px;
  }
}

.btn_big {
  padding: 15px 24px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 3px;

  @include media-breakpoint-up("md") {
    padding: 18px 26px;
    font-size: 24px;
  }
}

.btn_small {
  padding: 6px 8px;
  font-size: 9px;
  font-weight: 400;
  line-height: 1.3;

  @include media-breakpoint-up("md") {
    padding: 7px 15px 8px;
    font-size: 12px;
    font-weight: 500;
  }
}

.btn_full-width {
  width: 100%;
}

.btn_mobile-full-width {
  @include media-breakpoint-down("md") {
    width: 100%;
    font-size: 14px;
    text-transform: uppercase;
  }
}

.btn_primary:hover {
  background-color: $color-btn-bg-primary-hover;
}

.btn_secondary:hover {
  border-color: $color-btn-bg-secondary-hover;
}

.btn_tertiary:hover {
  border-color: $color-btn-bg-primary;
}

.btn:disabled {
  color: $color-btn-text-disabled;
  cursor: not-allowed;
}

.btn_primary:disabled {
  background-color: $color-btn-bg-disabled;
}

.btn_secondary:disabled,
.btn_tertiary:disabled {
  border-color: $color-btn-bg-disabled;
}

.btn__loader {
  display: flex;
  align-items: center;
}

.btn__loader-icon {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.btn_big .btn__loader-icon {
  width: 30px;
  height: 30px;
}

.btn_small .btn__loader-icon {
  width: 15px;
  height: 15px;
}

.btn_secondary:deep(.loading-icon__main),
.btn_tertiary:deep(.loading-icon__small) {
  fill: $color-primary-pre-light;
}

.btn_secondary:deep(.loading-icon__small),
.btn_tertiary:deep(.loading-icon__small) {
  fill: $slider-bg;
}
</style>
