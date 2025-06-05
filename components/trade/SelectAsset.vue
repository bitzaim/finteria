<template>
  <div class="select" @click="open" :class="{ select_open: selectOpen }" ref="$select">
    <div class="select__el" v-if="pair">
      <img
        class="select__icon"
        sizes="(min-width: 576px) 20px, 15px"
        :src="`/icons/${pairNames[0]}.svg`"
        :alt="pairNames[0]"
      />
      <span class="select__text">{{ pairNames[0] }}</span>

      <span class="select__text select__line">/</span>

      <img
        class="select__icon"
        sizes="(min-width: 576px) 20px, 15px"
        :src="`/icons/${pairNames[1]}.svg`"
        :alt="pairNames[1]"
      />
      <span class="select__text">{{ pairNames[1] }}</span>
    </div>

    <ul class="select__dropdown">
      <li
        class="select__row"
        v-for="item in pairs"
        :key="item.id"
        @click="setItem(item)"
        :class="{ select__dropdown_active: item === pair }"
      >
        <img
          class="select__icon"
          sizes="(min-width: 576px) 20px, 15px"
          :src="`/icons/${extractName(item, 'to')}.svg`"
        />
        <span class="select__text">{{ extractName(item, "to") }}</span>

        <span class="select__line select__text">/</span>

        <img
          class="select__icon"
          sizes="(min-width: 576px) 20px, 15px"
          :src="`/icons/${extractName(item, 'from')}.svg`"
        />
        <span class="select__text">{{ extractName(item, "from") }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { SelectAssetEmits, SelectAssetProps } from "@/types/trade.type";
import type { Pair } from "@/types/calculator.type";

import { onClickOutside } from "@vueuse/core";

const emit = defineEmits<SelectAssetEmits>();
const props = defineProps<SelectAssetProps>();

const $select = ref<HTMLDivElement | null>(null);

const selectOpen = ref<boolean>(false);

onClickOutside($select, () => {
  selectOpen.value = false;
});

const pairNames = computed<string[]>(() => {
  return props.pair.pair.split("/");
});

const extractName = (pair: Pair, slug: string) => {
  const currencyNames = pair.pair?.split("/");
  return slug === "from" ? currencyNames[1] : currencyNames[0];
};

const open = () => {
  if (props.disabled) {
    return;
  }
  selectOpen.value = !selectOpen.value;
};

const setItem = (item: Pair) => {
  emit("change", item);
};

onMounted(() => {
  if (props.pairs?.length) {
    emit("change", props.pairs[0]);
  }
});
</script>

<style scoped lang="scss">
.select {
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  min-height: 35px;
  padding: 6px 12px 6px 9px;
  cursor: pointer;
  background: $color-white;
  border: 2px solid $color-disable-light;
  border-radius: 8px;
  transition: 0.2s linear;
  -webkit-tap-highlight-color: transparent;

  @include media-breakpoint-up("md") {
    min-height: 40px;
    padding: 7px 12px 7px 9px;
  }
}

.select__el {
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-tap-highlight-color: transparent;
}

.select__el::after {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  margin-left: 5px;
  content: "";
  background-image: url("/icons/arrow.svg");
  background-repeat: no-repeat;
  background-position: 50% 60%;
  background-size: contain;
}

.select__text {
  font-size: 12px;
  font-weight: 600;
  line-height: initial;
  color: $color-text-darkest;
  text-transform: uppercase;
  -webkit-tap-highlight-color: transparent;

  @include media-breakpoint-up("md") {
    font-size: 15px;
  }
}

.select__dropdown {
  position: absolute;
  top: 100%;
  left: -2px;
  width: calc(100% + 4px);
  padding: 0 9px 5px 9px;
  visibility: hidden;
  background: $color-white;
  border: 2px solid $color-primary;
  border-top: 0;
  border-radius: 0 0 8px 8px;
  opacity: 0;
  transition: 0.2s linear;
}

.select__row {
  display: flex;
  align-items: center;
  width: calc(100% + 18px);
  padding: 5px 9px;
  margin: 0 -9px;
  cursor: pointer;
}

.select__row:hover {
  background: $color-primary-lightest;
}

.select__row_active {
  background: $color-primary-lightest;
}

.select__icon {
  width: 15px;
  height: 15px;
  margin-right: 8px;

  @include media-breakpoint-up("md") {
    width: 20px;
    height: 20px;
  }
}

.select__line {
  margin: 0 8px;
}

.select_open {
  border-color: $color-primary;
  border-radius: 8px 8px 0 0;
}

.select_open .select__dropdown {
  visibility: visible;
  opacity: 1;
}

.select_open .select__el::after {
  transform: rotate(180deg);
}
</style>
