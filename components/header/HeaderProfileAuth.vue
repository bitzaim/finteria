<template>
  <div ref="$headerProfileMenu" class="header__profile" :class="{ header__profile_active: isOpen }">
    <div v-if="useRuntimeConfig().public.SHOW_PROFILE" class="header__profile__btn" @click="openDropMenu">
      <IconPerson class="header__profile-icon header__profile-icon_active me-1" />
      {{ $t("header.btns.myAccount") }}
      <IconChevrone class="header__btn-icon ms-1" :class="{ 'header__btn-icon_active': isOpen }" />

      <button
        :disabled="false"
        small
        class="button button_yellow header__trade"
        @click.stop="redirectToDefaultProfilePlatform({ platform_type: 'options' }, false)"
      >
        Trade
      </button>
    </div>

    <div v-else class="header__profile__btn">
      <button
        :disabled="false"
        small
        class="button button_yellow header__trade"
        @click.stop="redirectToDefaultProfilePlatform({ platform_type: 'options' }, false)"
      >
        Trade
      </button>
    </div>

    <div v-if="isOpen" class="header__dropMenu">
      <NuxtLink
        class="header__dropMenu-link"
        :to="localePath('/profile/trading')"
        @click="closeMenu"
        :activeClass="'header__dropMenu-link_active'"
      >
        {{ $t("account.nav.trading") }}
      </NuxtLink>

      <NuxtLink
        class="header__dropMenu-link"
        :to="localePath('/profile?action=general')"
        @click="closeMenu"
        :activeClass="'header__dropMenu-link_active'"
      >
        {{ $t("account.nav.profile") }}
        <NuxtLink
          :to="localePath({ name: 'profile', query: { action: 'verification' } })"
          class="header__dropMenu-link-unverified"
          v-if="!store.user.identity_verified_at"
        >
          <icon-unverified />
          {{ $t("header.btns.unverified") }}
        </NuxtLink>
      </NuxtLink>

      <button class="header__dropMenu-link header__dropMenu-link__logout" type="button" @click="logoutUser">
        {{ $t("header.btns.logout") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";

import IconPerson from "@/components/icons/IconPerson.vue";
import IconChevrone from "@/components/icons/IconChevrone.vue";
import IconUnverified from "@/components/icons/IconUnverified.vue";

import services from "@/services/auth";

import { deleteCookie } from "@/utils/utilsCookies";
import { onClickOutside } from "@vueuse/core";
import { CookieMetaKeys, cookieMeta } from "@/utils/constants";
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";

const config = useRuntimeConfig();
const localePath = useLocalePath();
const $headerProfileMenu = ref(null);
const store = useUserStore();

const isOpen = ref(false);

const openDropMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

// TODO есть ошибка при выходе из аккаунта, если мы находимся на вкладке account
const logoutUser = async () => {
  closeMenu();
  await navigateTo({ path: localePath("/") });
  await services.logoutUser();
  const sentryEnv = config.public.SENTRY_ENV as CookieMetaKeys;
  const tokenName = cookieMeta[sentryEnv].name;
  deleteCookie(tokenName);
  store.SET_USER(null);
  store.SET_VERIFICATION(null);
};

onClickOutside($headerProfileMenu, closeMenu);
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";

.header__trade {
  padding: 7px 10px 8px;
  margin-left: 20px;
  font-size: 14px;
  color: $color-text-dark;
  letter-spacing: 0;
  border-radius: 4px;
  @include media-breakpoint-down("md") {
    margin-left: 12px;
  }
}
.header__profile {
  position: relative;
  display: flex;
  gap: 6px;
  padding: 14px 0px;
  margin-left: auto;
  font-weight: 700;

  &_active::after {
    position: absolute;
    bottom: 0%;
    left: 50%;
    content: "";
    border-right: 6px solid transparent;
    border-bottom: 6px solid $color-primary;
    border-left: 6px solid transparent;
    transform: translate(-50%, 0%);
  }
}

.header__profile .icon {
  margin-right: 6px;
}

.header__dropMenu {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 10;
  width: max-content;
  min-width: 169px;
  background: $color-white;
  border-top: 1px solid $color-primary;
  box-shadow: 0px 0px 10px 0px $color-border-light;
  transform: translate(-50%, 0);
}

.header__profile__btn {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header__dropMenu-link {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 16px;
  font-weight: 400;
  color: $color-text-dark;
  text-align: left;
  background: $color-transparent;
  border: none;

  &:hover {
    background: $color-primary-lightest;
  }
}

.header__dropMenu-link_active {
  position: relative;
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    content: "";
    background-color: $color-white;
    border: 0;
  }
}

.header__dropMenu-link-unverified {
  display: flex;
  align-items: center;
  padding: 0px 5px 0 2px;
  margin-bottom: -1px;
  margin-left: 4px;
  font-size: 12px;
  font-weight: 500;
  color: $color-orange-dark;
  background-color: $color-white;
  border: 1px solid $color-orange-dark;
  border-radius: 15px;
  & svg {
    margin-right: 2px;
  }
}

.header__dropMenu-link__logout {
  margin-top: 5px;
  color: $color-grey;
}

.header__profile-icon {
  width: 24px !important;
  height: 24px !important;
  font-size: 24px;
  color: $color-orange-dark;
}

.header__profile-icon_active {
  padding: 2px;
  background: $color-orange-lightest;
  border-radius: 50%;
}

.header__btn-icon {
  margin-left: auto;
  font-size: 10px;
  color: $color-primary;
  transition: transform $transition-time;
}

.header__btn-icon_active {
  transform: rotate(180deg);
}
</style>
