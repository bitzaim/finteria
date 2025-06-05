<template>
  <header class="header__wrap">
    <div class="container header">
      <NuxtLink :to="localePath(logoLink)" class="header__icon">
        <picture>
          <source media="(min-width: 576px)" srcset="/img/header/logo.svg" />
          <img
            class="logo"
            src="/img/header/logo-without-text.svg"
            sizes="(min-width: 576px) 127px, 50px"
            height="30"
            alt="Finteria"
          />
        </picture>
      </NuxtLink>

      <div class="header__mobile-wrapper">
        <HeaderProfile />
      </div>

      <div class="burger header__burger" @click="openDropMenu">
        <div class="burger__line"></div>
        <div class="burger__line"></div>
        <div class="burger__line"></div>
      </div>

      <div
        class="header__dropMenu_overlay"
        :class="{ 'header__dropMenu_overlay--hidden': !dropMenuIsOpen }"
        @click="closeDropMenu"
      ></div>

      <div class="header__dropMenu" :class="{ 'header__dropMenu--hidden': !dropMenuIsOpen }">
        <button
          ref="$closeBtn"
          type="button"
          class="header__dropMenu_close"
          @click="closeDropMenu"
          :title="$t('header.btns.close')"
        >
          <IconClose />
        </button>

        <nav class="nav" :class="{ hidden: true }">
          <NuxtLink
            class="nav__link"
            :activeClass="'nav__link_active'"
            :to="localePath(link.route)"
            v-for="(link, index) in navLinks"
            :key="`navLink${index}`"
            @click="closeDropMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <ul class="header__main-links">
          <li class="header__main-links-item">
            <button
              v-if="useRuntimeConfig().public.SHOW_PROFILE && isAuth"
              class="header__main-link"
              @click.stop="redirectToDefaultProfilePlatform({ platform_type: 'options' }, false)"
            >
              {{ $t("header.menu.services.platform") }}
            </button>
            <a
              v-else
              :href="optionsPlatformURL"
              class="header__main-link"
              target="_blank"
              @click.stop="redirectToDefaultProfilePlatform({ platform_type: 'options' }, false)"
            >
              {{ $t("header.menu.services.platform") }}
            </a>
          </li>
          <li class="header__main-links-item">
            <NuxtLink class="header__main-link" :to="localePath('/contest')">{{
              $t("header.menu.services.contest")
            }}</NuxtLink>
          </li>
          <li class="header__main-links-item">
            <NuxtLink class="header__main-link" :to="localePath('/blog')">{{
              $t("header.menu.services.blog")
            }}</NuxtLink>
          </li>
        </ul>

        <HeaderActions class="header__actions" @close="closeDropMenu" />
      </div>
    </div>
  </header>
</template>

<script setup>
import IconClose from "@/components/icons/IconClose.vue";
import HeaderProfile from "@/components/header/HeaderProfile.vue";
import { useScroll } from "@vueuse/core";
import { useUserStore } from "~~/stores/userStore";
import { useDomain } from "@/composition/useDomain";
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";

const userStore = useUserStore();
const { optionsPlatformURL } = useDomain();
const dropMenuIsOpen = ref(false);
const $closeBtn = ref();
const localePath = useLocalePath();

const isAuth = computed(() => userStore.isAuth)

const navLinks = [
  { label: "Trade", route: "/", key: "trade" },
  { label: "Exchange", route: "/exchange", key: "exchange" },
];
const logoLink = computed(() => {
  if (useRuntimeConfig().public.SHOW_PROFILE && isAuth.value) {
    return "/profile/trading";
  } else {
    return "/";
  }
});

const openDropMenu = () => {
  document.body.overflow = "hidden";
  dropMenuIsOpen.value = true;
  document.querySelector("body").classList.add("scroll-off");
  useScroll(document.querySelector("body"), {
    behavior: "smooth",
  });
};

const closeDropMenu = () => {
  dropMenuIsOpen.value = false;
  document.querySelector("body").classList.remove("scroll-off");
};
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";
.header__mobile-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-left: auto;

  @include media-breakpoint-up("md") {
    display: none;
  }
}
.header__mobile-item {
  display: none;
  @include media-breakpoint-down("md") {
    display: block;
  }
}
.header.container {
  @include media-breakpoint-down("xl") {
    max-width: none;
    padding: 0px;
    background: $color-primary-lightest;
  }
  @include media-breakpoint-down("md") {
    padding-right: 10px;
    padding-left: 10px;
  }
  @include media-breakpoint-down("sm") {
    max-width: none;
    background: unset;
  }
}

.logo {
  width: 127px;
  height: 30px;

  @include media-breakpoint-up("md") {
    width: 165px;
    height: 40px;
  }

  @include media-breakpoint-up("lg") {
    width: 218px;
    height: 53px;
  }
  @include media-breakpoint-down("sm") {
    width: 50px;
    height: 30px;
  }
}

.header__dropMenu_close {
  display: none;
  @include media-breakpoint-down("md") {
    position: absolute;
    top: 22px;
    right: 20px;
    z-index: 2;
    display: flex;
    color: $color-white;
    background: none;
    border: none;
  }
}

.header__wrap {
  border-bottom: 1px solid $color-disable-light;
}

.header {
  position: relative;
  display: flex;
  align-items: center;

  @include media-breakpoint-down("xl") {
    position: relative;
  }
}

.nav {
  margin-right: auto;
  margin-left: 5%;
  @include media-breakpoint-down("xl") {
    padding-right: 40px;
    margin-right: initial;
    margin-left: auto;
  }
  @include media-breakpoint-down("md") {
    padding-right: 20px;
  }

  @include media-breakpoint-down("sm") {
    display: flex;
    flex-direction: column;
    gap: 1px;
    width: 100%;
    padding-right: 0px;
    margin-top: 43px;
  }

  &.hidden {
    display: none;
    visibility: hidden;
  }
}

.nav__link {
  position: relative;
  display: inline-block;
  padding: 30px 20px;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  color: $color-primary;
  text-transform: uppercase;
  transition: background-color $transition-time, color $transition-time;
  &:hover {
    color: $color-primary;
    background-color: darken($color-primary-lightest, 10%);
  }
  &:hover:after {
    position: absolute;
    top: 0%;
    left: 50%;
    width: 0px;
    height: 0px;
    content: "";
    border-top: 6px solid $color-white;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    transform: translate(-50%, 0%);
  }
  &:before {
    position: absolute;
    top: 50%;
    right: 0%;
    width: 1px;
    height: 50%;
    content: "";
    background: $color-disable-light;
    transform: background $transition-time;
    transform: translateY(-50%);
    @include media-breakpoint-down("sm") {
      display: none;
    }
  }
  &:hover:before {
    background: $color-transparent;
  }

  @include media-breakpoint-down("sm") {
    padding: 10px 20px;
    color: $color-white;
    background: $color-primary-dark;
  }
}

.nav__link_active {
  color: $color-white;
  background-color: $color-primary;
  &:hover {
    color: $color-white;
    background-color: $color-primary;
  }
  &:after {
    position: absolute;
    top: 0%;
    left: 50%;
    width: 0px;
    height: 0px;
    content: "";
    border-top: 6px solid $color-white;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    transform: translate(-50%, 0%);
  }

  @include media-breakpoint-down("sm") {
    background: $color-primary-dark;
    &:after {
      top: 0;
      left: 2px;
      width: 3px;
      height: 100%;
      background-color: $color-white;
      border: 0;
    }
  }
}

.header__icon {
  @include media-breakpoint-down("xl") {
    padding-left: 40px;
  }
  @include media-breakpoint-down("md") {
    padding-left: 20px;
  }
  @include media-breakpoint-down("sm") {
    padding-left: 0px;
  }
}

.header__dropMenu-wrap {
  display: contents;
  @include media-breakpoint-down("sm") {
    position: fixed;
    top: 0%;
    right: -100%;
    z-index: 10;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 100vh;

    background: rgba($color-text-dark, 60%);
    transition: right $transition-time;
  }
}

.header__dropMenu-wrap_active {
  right: 0%;
}

.header__dropMenu_overlay {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
  width: 100%;
  height: 100vh;
  visibility: hidden;
  background: rgba($color-text-dark, 60%);
  opacity: 0;
  transition: opacity $transition-time;
  @include media-breakpoint-down("md") {
    visibility: visible;
    opacity: 1;
  }
}
.header__dropMenu_overlay--hidden {
  visibility: hidden;
  opacity: 0;
}

.header__dropMenu {
  display: contents;
  @include media-breakpoint-down("md") {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    height: 100%;
    overflow-y: scroll;
    color: $color-white;
    background: $color-primary;
    transition: right $transition-time;
  }
}

.header__dropMenu--hidden {
  right: -100%;
}

.burger {
  display: none;

  @include media-breakpoint-down("md") {
    display: flex;
    flex-direction: column;
    gap: 3px;
    justify-content: center;
    width: 20px;
    height: 20px;
  }
}

.burger__line {
  width: 100%;
  height: 2px;
  background: $color-orange;
}

.header__burger {
  margin-left: 10px;
}

.header__main-links {
  display: none;
  color: $color-primary;

  @include media-breakpoint-up("xl") {
    display: flex;
    column-gap: 37px;
    padding: 8px 0 8px 37px;
    margin: 0;
    margin-left: 40px;
    border-left: 1px solid $color-disable-light;
  }
}

.header__main-link {
  @include media-breakpoint-up("xl") {
    font-size: 17px;
    font-weight: 700;
    line-height: 1.4;
    text-transform: uppercase;
    letter-spacing: 1.7px;
  }
}

.header__actions {
  @include media-breakpoint-up("xl") {
    margin-left: auto;
  }
}
</style>
