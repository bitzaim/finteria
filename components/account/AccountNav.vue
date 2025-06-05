<template>
  <div class="account-nav">
    <button class="account-nav__button" :class="{ 'account-nav__button_active': dropMenuIsActive }" type="button">
      <component :is="currentIconForMobile" class="account-nav__general-icon"></component>
      {{ $t(`account.navHelper.${routeName}.label`) }}
    </button>

    <div class="account-nav__wrap">
      <NuxtLink
        v-for="(nav, index) in NAVIGATION"
        :key="`nav${index}`"
        :to="localePath(nav.path)"
        :class="`account-nav__item ${
          nav.exact
            ? currentPath === localePath(nav.path)
              ? 'account-nav__item-active'
              : ''
            : currentPath.includes(localePath(nav.path))
            ? 'account-nav__item-active'
            : ''
        }`"
      >
        <component :is="nav.icon" class="account-nav__icon"></component>
        {{ $t(`account.nav.${nav.translationKey}`) }}
      </NuxtLink>
    </div>

    <div class="account-nav__button-wrap">
      <BaseButton
        type="button"
        :is-loading="isRedirecting"
        :loading-text="$t('common.btns.waiting')"
        @click="openDefaultProfilePlatform"
      >
        {{ $t("account.nav.button") }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import Trading from "@/components/icons/IconTrading.vue";
import Profile from "@/components/icons/IconProfile.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";

import { redirectToDefaultProfilePlatform } from "~~/services/helpers";

const route = useRoute();

const routeName = computed(() => route.name.split("_")[0]);
const localePath = useLocalePath();

const NAVIGATION = [
  {
    path: "/profile/trading/",
    exact: false,
    icon: Trading,
    translationKey: "trading",
  },
  {
    path: "/profile/",
    exact: true,
    icon: Profile,
    translationKey: "profile",
  },
];

const dropMenuIsActive = ref(false);

const currentPath = computed(() => {
  const output = localePath(route.path);
  return output;
});

const currentIconForMobile = computed(() => {
  const activeNav = NAVIGATION.find((obj) => currentPath.value === localePath(obj.path));
  if (activeNav) {
    return activeNav.icon;
  }
});

const isRedirecting = ref(false);
async function openDefaultProfilePlatform() {
  try {
    isRedirecting.value = true;
    await redirectToDefaultProfilePlatform({}, false);
  } catch (error) {
    console.log(error);
  } finally {
    isRedirecting.value = false;
  }
}
</script>

<style scoped lang="scss">
.account-nav {
  position: relative;
  grid-area: nav;
  background-color: $color-white;
}

.account-nav__wrap {
  @include media-breakpoint-down("lg") {
    display: flex;
    width: 100%;
  }
  @include media-breakpoint-down("sm") {
    display: none;
  }
}

.account-nav__button {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 20px 10px 20px;
  font-size: 22px;
  font-weight: 500;
  color: $color-text-dark;
  background: none;

  background-color: $color-disable;
  border: none;
  transition: all $transition-time;
  @include media-breakpoint-up("sm") {
    display: none;
  }
}

.account-nav__icon {
  width: 20px;
  height: 20px;
  color: $color-btn-disable;
}

.account-nav__general-icon {
  width: 20px;
  color: $color-primary;
}

.account-nav__chevrone {
  width: 14px;
  height: 8px;
  color: $color-primary;
}

.account-nav__button_active {
  color: $color-white;
  background: $color-primary-dark;
  & .account-nav__chevrone {
    color: $color-white;
    transform: rotate(180deg);
  }

  & .account-nav__general-icon {
    color: $color-primary-lightest;
  }
}

.account-nav__button_active ~ .account-nav__wrap {
  display: flex;
}

.account-nav__item {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 14px 0px 14px 33px;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 145%;
  color: $color-text-dark;
  border-bottom: 1px solid $color-disable;
  transition: background $transition-time;
  &:hover {
    background: $color-primary-lightest;
  }
  &:hover::after {
    position: absolute;
    top: 50%;
    left: 0;
    content: "";
    border-top: 6px solid #fff0;
    border-bottom: 6px solid transparent;

    border-left: 6px solid $color-white;
    transform: translate(0%, -50%);
  }
  @include media-breakpoint-down("lg") {
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    padding: 15px 0px;
  }
}

.account-nav__item-active {
  position: relative;
  font-weight: 700;
  background-color: $color-primary-lightest;
  &::after {
    position: absolute;
    top: 50%;
    left: 0;
    content: "";
    border-top: 6px solid #fff0;
    border-bottom: 6px solid transparent;

    border-left: 6px solid $color-white;
    transform: translate(0%, -50%);
  }
  @include media-breakpoint-down("lg") {
    &::after {
      position: absolute;
      top: 0%;
      left: 50%;
      content: "";
      border-top: 6px solid $color-white;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      transform: translate(-50%, 0%);
    }
  }
}

.account-nav__button-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 0 14px;

  @include media-breakpoint-down("sm") {
    display: none;
    width: fit-content;
    padding: 0px;
    border-top: none;
  }
}

.account-nav__item-active .account-nav__icon {
  color: $color-primary;
}
</style>
