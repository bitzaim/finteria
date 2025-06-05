<template>
  <div ref="$el" class="lang-picker">
    <button
      type="button"
      class="lang-picker__selector-active"
      :class="{
        'lang-picker__selector-active_opened': modelValue,
      }"
      @click="toggleDropMenu"
      :title="activeLang.name"
    >
      <IconSphere />
      <span class="lang-picker__active-title" v-text="activeLang.name" />
      <IconChevrone
        fill="#FBC920"
        class="lang-picker__selector-active-item-icon"
        :class="{ 'lang-picker__selector-active-item-icon_active': modelValue }"
      />
    </button>

    <ul v-show="modelValue" class="lang-picker__selector-dropdown">
      <li
        class="lang-picker__selector-dropdown-item"
        :class="{
          'lang-picker__selector-dropdown-item--full-width': lang.code == 'uk'
        }"
        v-for="lang of languages"
        :key="lang.code"
      >
        <NuxtLink class="lang-picker__selector-item" :to="switchLocalePath(lang.code)" @click.prevent="onChangeLang(lang.code)">
          <IconFlag :flag="lang.code" />
          <span class="lang-picker__item-title" v-text="lang.name" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Props, Emits } from "./LangPicker.type";
import IconChevrone from "@/components/icons/IconChevrone.vue";
import IconFlag from "@/components/icons/IconFlag.vue";
import IconSphere from "@/components/icons/IconSphere.vue";
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

const $el = ref(null);

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
  width: 86%;
  padding: 5px 10px;
  border: 1px solid $color-primary-border;
}

.lang-picker__active-title {
  margin: 0 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}

.lang-picker__selector-active-item-icon {
  margin-left: 3px;
  color: $color-primary;
  transition: transform 0.3s;
}

.lang-picker__selector-active-item-icon_active {
  transform: rotate(180deg);
}

.lang-picker__selector-active_opened {
  background: $color-primary-border;
}

.lang-picker__selector-dropdown {
  position: absolute;
  top: calc(100% - 2px);
  left: 0px;
  z-index: 10;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  width: 86%;
  margin-bottom: 0;
  background-color: $color-primary-border;
  box-shadow: 0px 0px 10px $color-shadow-primary;
}

.lang-picker__selector-dropdown-item {
  width: 50%;
}

.lang-picker__selector-dropdown-item--full-width {
  width: 100%;
}

.lang-picker__selector-item {
  display: flex;
  align-items: center;
  padding: 8px 1px 8px 10px;
  color: $color-text-dark;
}

.lang-picker__selector-item:hover {
  background-color: $color-primary-light-trade;
}

.lang-picker__item-title {
  margin-left: 10px;
  color: $color-white;
}
</style>
