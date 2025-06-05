<template>
  <div ref="$el" class="lang-picker">
    <button type="button" class="lang-picker__selector-active" @click="toggleDropMenu" :title="activeLang.name">
      <IconFlag :flag="activeLang.code" />
      <span class="lang-picker__active-title">
        {{ activeLang.code }}
      </span>
      <IconChevrone
        v-show="!withoutChevrone"
        class="lang-picker__selector-active-item-icon"
        :class="{ 'lang-picker__selector-active-item-icon_active': modelValue }"
      />
    </button>

    <ul v-show="modelValue" class="lang-picker__selector-dropdown">
      <li class="lang-picker__selector-dropdown-item" v-for="lang of languages" :key="lang.code">
        <NuxtLink
          class="lang-picker__selector-item"
          :to="switchLocalePath(lang.code)"
          @click.prevent="onChangeLang(lang.code)"
          no-prefetch
        >
          <IconFlag :flag="lang.code" />
          <span class="lang-picker__item-title">
            {{ lang.name }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Props, Emits } from "./LangPicker.type";
import IconChevrone from "@/components/icons/IconChevrone.vue";
import IconFlag from "@/components/icons/IconFlag.vue";
import { onClickOutside } from "@vueuse/core";
import { setCookie } from "@/utils/utilsCookies";
import { COOKIE_LANGUAGE } from '@/constants/i18n';

const i18n = useI18n();
const switchLocalePath = useSwitchLocalePath();

const props = withDefaults(defineProps<Props>(), {
  languages: () => [],
  withoutChevrone: false,
});

const emit = defineEmits<Emits>();

const $el = ref<HTMLDivElement | null>(null);

const toggleDropMenu = () => {
  emit("update:modelValue", !props.modelValue && !!props.languages.length);
};

const closeDropMenu = () => {
  emit("update:modelValue", false);
};

const onChangeLang = (langCode: string) => {
  setCookie(COOKIE_LANGUAGE, langCode, { expires: 'Fri, 31 Dec 9999 23:59:59 GMT', })
  closeDropMenu()
}

onClickOutside($el, closeDropMenu);
</script>

<style scoped lang="scss">
@import "@/assets/style/include.scss";

.lang-picker {
  position: relative;
  display: flex;
  flex-direction: column;
}

.lang-picker__selector-active {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.lang-picker__active-title {
  margin: 0 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;

  @include media-breakpoint-down("sm") {
    display: none;
  }
}

.lang-picker__selector-active-item-icon {
  margin-left: 3px;
  color: $color-primary;
  transition: transform 0.3s;
}

.lang-picker__selector-active-item-icon_active {
  transform: rotate(180deg);
}

.lang-picker__selector-dropdown {
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  z-index: 10;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: $color-white;
  border-top: 1px solid $color-primary;
  box-shadow: 0px 0px 10px $color-shadow-primary;
  transform: translate(-50%, 0);
}

.lang-picker__selector-dropdown::before {
  position: absolute;
  top: -6px;
  left: 50%;
  content: "";
  border-right: 6px solid transparent;
  border-bottom: 6px solid $color-primary;
  border-left: 6px solid transparent;
  transform: translate(-50%, 0%);
}

.lang-picker__selector-item {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  color: $color-text-dark;
}

.lang-picker__selector-item:hover {
  background-color: $color-primary-light-trade;
}

.lang-picker__item-title {
  margin-left: 10px;
}
</style>
