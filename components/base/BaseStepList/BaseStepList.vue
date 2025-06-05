<template>
  <component
    class="step-list"
    :class="{
      'step-list_numbered': isNumbered,
    }"
    :is="listTag"
  >
    <li
      class="step-list__item"
      :class="{
        [`step-list__item_${item.slug}`]: true,
      }"
      v-for="(item, itemIdx) in items"
      :key="getHashKeyByTitleAndIndex(item.title, itemIdx)"
    >
      <h3 class="step-list__title">{{ $t(item.title) }}</h3>
      <p class="step-list__text">{{ $t(item.text) }}</p>
    </li>
  </component>
</template>

<script setup lang="ts">
import type { Props } from "./BaseStepList.type";
import { getHashKeyByTitleAndIndex } from "@/utils/helpers";

const props = defineProps<Props>();

const listTag = computed<string>(() => {
  return props.isNumbered ? "ol" : "ul";
});
</script>

<style scoped lang="scss">
.step-list {
  padding: 0;
  margin: 0;
  list-style: none;

  @include media-breakpoint-up("lg") {
    display: flex;
    justify-content: space-between;
  }
}

.step-list_numbered {
  counter-reset: item;
}

.step-list__item {
  position: relative;
  max-width: 520px;
  padding: 50px 50px 30px;
  margin: 20px auto 0;
  background-color: $color-primary-lightest;

  @include media-breakpoint-up("md") {
    padding-top: 50px;
    padding-bottom: 38px;
    margin-top: 30px;
  }

  @include media-breakpoint-up("lg") {
    width: 300px;
    max-width: none;
  }

  @include media-breakpoint-up("xxl") {
    width: 410px;
  }
}

.step-list__item:not(:last-child) {
  margin-bottom: 40px;

  @include media-breakpoint-up("lg") {
    margin-bottom: 0;
  }
}

.step-list__item::before {
  position: absolute;
  top: -30px;
  left: 50%;
  width: 64px;
  height: 64px;
  content: "";
  background-repeat: no-repeat;
  background-position: center;
  background-size: 64px 64px;
  transform: translateX(-50%);
}

.step-list__item_flag::before {
  background-image: url("/icons/steps/flag.svg");
}

.step-list__item_wallet::before {
  background-image: url("/icons/steps/wallet.svg");
}

.step-list__item_trade::before {
  background-image: url("/icons/steps/trade.svg");
}

.step-list__title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
}

.step-list_numbered .step-list__title:before {
  font-size: 16px;
  font-weight: 700;
  color: $color-primary;
  content: counter(item) ". ";
  counter-increment: item;

  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}

.step-list__text {
  max-width: 470px;
  margin: 10px auto 0;
  line-height: 1.4;
  text-align: center;

  @include media-breakpoint-up("md") {
    line-height: 1.45;
  }

  @include media-breakpoint-up("lg") {
    max-width: 272px;
  }

  @include media-breakpoint-up("xxl") {
    max-width: 372px;
  }
}
</style>
