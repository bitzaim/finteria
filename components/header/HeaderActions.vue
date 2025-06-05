<template>
  <div ref="$headerMenu" class="header__actions">
    <div class="header__desktop-wrapper">
      <div class="header__lang-picker_primary">
        <LangPicker
          v-model="langPicker"
          :languages="availableLocales"
          :active-lang="activeLang"
        />
      </div>

      <div class="header__lang-picker_secondary">
        <SecondaryLangPicker
          v-model="langPickerSecondary"
          :languages="availableLocales"
          :active-lang="activeLang"
        />
      </div>
    </div>

    <div class="header__menu" :class="{ header__menu_active: isOpen }">
      <button class="header__btn" :class="{ header__btn_active: isOpen }" type="button" @click="handleDropMenu">
        {{ $t("header.menu.menu") }}
      </button>

      <div class="header__drop-menu" v-show="isOpen">
        <HeaderModule v-for="(module, index) in headerMenu" :key="index" :module="module" @close="closeMenu" />
      </div>
    </div>

    <HeaderProfile class="header__profile" @close="emits('close')" />
  </div>
</template>

<script setup>
import HeaderProfile from "@/components/header/HeaderProfile.vue";

const HeaderModule = defineAsyncComponent(() => import("@/components/header/HeaderModule.vue"));

import { useHeaderMenu } from "@/constants/header";

import { onClickOutside, useWindowSize } from "@vueuse/core";
import LangPicker from "./LangPicker/LangPicker.vue";
import SecondaryLangPicker from "@/components/header/LangPicker/SecondaryLangPicker.vue";

const { locale, locales } = useI18n();
const { width } = useWindowSize();

const emits = defineEmits(["click", "close"]);

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});

const activeLang = computed(() => locales.value.find((i) => i.code === locale.value));

const isOpen = ref(false);
const headerMenu = useHeaderMenu();
const $headerMenu = ref(null);

const langPicker = ref(false);
const langPickerSecondary = ref(false);

const closeMenu = () => {
  if (width.value >= 768) {
    isOpen.value = false;
  }
  emits("close");
};

const handleDropMenu = () => {
  if (width.value >= 768) {
    isOpen.value = !isOpen.value;
  }
};

onClickOutside($headerMenu, () => {
  closeMenu();
});

watchEffect(() => {
  isOpen.value = width.value < 768;

  if (langPicker.value) {
    closeMenu()
  }
});
</script>

<style scoped lang="scss">
.header__desktop-wrapper {
  @include media-breakpoint-down("md") {
    padding: 16px 14px;
  }
}

.header__lang-picker_primary {
  display: none;

  @include media-breakpoint-up("md") {
    display: inline-block;
  }
}

.header__lang-picker_secondary {
  @include media-breakpoint-up("md") {
    display: none;
  }
}

.header__actions {
  display: flex;
  gap: 25px;
  align-items: center;
  justify-content: flex-end;

  @include media-breakpoint-down("xl") {
    position: relative;
    width: 100%;
    padding: 10px 40px 10px 10px;
  }
  @include media-breakpoint-down("md") {
    display: contents;
    background: inherit;
  }
}

.header__menu {
  position: relative;
  @include media-breakpoint-down("md") {
    margin-left: unset;
  }
}

.header__btn {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 14px 0px;
  font-weight: 700;
  background: none;
  border: none;

  @include media-breakpoint-down("md") {
    display: none;
  }
}

.header__btn::before {
  width: 24px;
  height: 24px;
  content: "";
  background-image: url("/img/header/icon-menu.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.header__btn::after {
  width: 10px;
  height: 7px;
  margin-left: auto;
  content: "";
  background-image: url("/icons/chevron.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transition: transform $transition-time;
}

.header__btn_active::after {
  transform: rotate(180deg);
}

.header__drop-menu {
  position: absolute;
  top: 100%;
  right: -100%;
  z-index: 10;
  display: flex;
  gap: 40px;
  width: max-content;
  background: $color-white;
  border-top: 1px solid $color-primary;
  box-shadow: 0px 0px 5px #ccc;

  @include media-breakpoint-down("xl") {
    right: inherit;
    left: 0;
  }

  @include media-breakpoint-down("lg") {
    transform: translateX(-30%);
  }

  @include media-breakpoint-down("md") {
    position: static;
    top: 0;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    background: transparent;
    box-shadow: none;
    transform: none;
  }

  @include media-breakpoint-down("sm") {
    gap: 0;
  }
}

.header__menu_active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  content: "";
  border-right: 6px solid transparent;
  border-bottom: 6px solid $color-primary;
  border-left: 6px solid transparent;
  transform: translate(-50%, 0%);
}

.header__profile {
  display: none;

  @include media-breakpoint-up("md") {
    display: block;
  }
}
</style>
