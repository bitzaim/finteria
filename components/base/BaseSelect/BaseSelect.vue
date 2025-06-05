<template>
  <div class="select" ref="$el">
    <div
      class="select__item"
      :class="{
        select__item_bold: isCrypto,
        select__item_border: border,
        select__item_hidden: isStateOpen,
        'select__item_with-balance': withBalance,
        select__item_disabled: disabled,
        select__item_uppercase: upperCase,
      }"
      @click="toggleDropMenu"
    >
      <p class="select__placeholder" v-if="placeholderText && !selectedItem">{{ placeholderText }}</p>
      <img
        v-if="selectedItem && isIcons && typeof selectedItem !== 'string' && selectList?.length"
        :src="`/icons/${selectedItem?.display_code || selectedItem.value}.svg`"
        class="select__img"
      />

      {{ selectedItemLabel }}

      <div class="select__item-balance" v-if="typeof selectedItem !== 'string' && withTitleBalance">
        {{ trimFloatNumber(selectedItem?.balance) }}
      </div>

      <IconChevrone :class="['select__icon', { select__icon_active: isOpen, select__icon_auto: !withTitleBalance }]" />
    </div>

    <button class="select__clear" type="button" :title="$t('header.btns.close')">
      <IconCloseInput v-if="clearable" @click="selectCurrency(null)" />
    </button>

    <ul v-show="isOpen || isStateOpen" class="select__menu" :class="{ select__menu_relative: isStateOpen }">
      <li
        v-for="(selectListItem, index) in selectList"
        class="select__menu-item"
        :class="{
          'select__menu-item_bold': isCrypto,
          'select__menu-item_active': selectedItem === selectListItem,
          'select__menu-item_uppercase': upperCase,
        }"
        :key="`currencyList${index}`"
        @click="selectCurrency(selectListItem)"
      >
        <img
          v-if="isIcons && typeof selectListItem !== 'string' && selectList.length"
          :src="`/icons/${selectListItem.display_code || selectListItem.value}.svg`"
          class="select__img"
        />

        <template v-if="enums">
          {{ selectListItem }}
        </template>
        <template v-else-if="typeof selectListItem !== 'string' && dataLabel">
          {{ selectListItem[dataLabel] }}
        </template>

        <span v-if="typeof selectListItem !== 'string' && withBalance" class="select__menu-item-balance">
          {{ trimFloatNumber(selectListItem.balance) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Props, SelectItem, Emits } from "./BaseSelect.type";
import { trimFloatNumber } from "@/utils/processNumbers";
import { onClickOutside } from "@vueuse/core";

import IconChevrone from "@/components/icons/IconChevrone.vue";
import IconCloseInput from "@/components/icons/IconCloseInput.vue";

const props = withDefaults(defineProps<Props>(), {
  isStateOpen: false,
  border: false,
  withBalance: false,
  withTitleBalance: false,
  isIcons: false,
  disabled: false,
  dataLabel: "display_code",
  dataValue: "display_code",
  enums: false,
  isCrypto: false,
  upperCase: true,
  placeholderText: "",
});

const emits = defineEmits<Emits>();
const isOpen = ref<boolean>(false);
const $el = ref<HTMLDivElement | null>(null);

const selectedItemLabel = computed<string>(() => {
  if (props.enums && typeof props.selectedItem === "string") {
    return props.selectedItem;
  }

  return props.selectedItem && props.dataLabel && typeof props.selectedItem !== "string"
    ? String(props.selectedItem[props.dataLabel])
    : "";
});

const selectCurrency = (currency: SelectItem | string | null) => {
  isOpen.value = false;
  emits("update:selectedItem", currency);
};

const toggleDropMenu = () => {
  if (!props.disabled && props.selectList.length) {
    isOpen.value = !isOpen.value;
  }
};

const closeDropMenu = () => {
  isOpen.value = false;
};

onClickOutside($el, closeDropMenu);
</script>

<style scoped lang="scss">
@import "@/assets/style/include.scss";

.select {
  position: relative;
  text-transform: capitalize;
}

.select__item {
  position: relative;
  display: flex;
  gap: 6px;
  align-items: center;
  min-width: 120px;
  height: 100%;
  min-height: 45px;
}

.select__item_disabled {
  pointer-events: none;
  background-color: $color-disable;
}

.select__item_uppercase {
  text-transform: uppercase;
}

.select__item_border-bottom {
  border-bottom: 1px solid $color-disable-light;
}

.select__item_border {
  border: 1px solid $color-disable-light;
  border-radius: 4px;
}

.select__item_hidden {
  display: none;
}

.select__item_with-balance {
  min-width: 190px;
}

.select__item,
.select__menu-item {
  display: flex;
  align-items: center;
  padding: 10px;
  white-space: nowrap;
  cursor: pointer;
  transition: background $transition-time;
}

.select__item:hover,
.select__menu-item:hover {
  background: $color-primary-lightest;
}

.select__placeholder {
  font-size: 16px;
  font-weight: 600;
  color: $color-disable-dark;
  text-transform: none;
  opacity: 0.7;
}

.select__icon {
  width: 14px;
  color: $color-primary;
  transition: transform $transition-time;
}

.select__clear {
  position: absolute;
  top: 50%;
  right: 30px;
  z-index: 1;
  padding: 0;
  margin-left: auto;
  cursor: pointer;
  background: transparent;
  border: 0;
  outline: none;
  transform: translate(0%, -50%);
}

.select__icon_active {
  transform: rotate(180deg);
}

.select__icon_auto {
  margin-left: auto;
}

.select__img {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}

.select__menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 200px;
  padding: 0;
  overflow: auto;
  list-style: none;
  background: $color-white;
  box-shadow: 0px 4px 5px rgba($color-text-dark, 0.4);
}

.select__menu_relative {
  position: static;
  max-height: none;
  overflow-y: auto;
  background: inherit;
  box-shadow: none;
}

.select__menu-item_active {
  background: $color-primary-lightest;
}

.select__item-balance,
.select__menu-item-balance {
  margin-left: auto;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  color: $color-text-dark;
}

.select__menu-item_uppercase {
  text-transform: uppercase;
}

.select__menu_relative .select__menu-item_active {
  background: inherit;
}

.select__item_bold,
.select__menu-item_bold {
  font-weight: 700;
}
</style>
