<template>
  <div>
    <BaseLoader v-if="loading" />

    <section v-else>
      <div class="account__wrap">
        <div class="container account">
          <AccountNav />
          <div class="account-content">
            <slot />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AccountNav from "./AccountNav.vue";
import BaseLoader from "../base/BaseLoader/BaseLoader.vue";

import { onMounted, ref, onBeforeUpdate } from "vue";
import { useUserStore } from "@/stores/userStore";
import { path } from "@/constants/routes";
import { navigateTo } from "nuxt/app";
import { cookieMeta, CookieMetaKeys } from "@/utils/constants";
const route = useRoute();
const userStore = useUserStore();
const loading = ref(true);
const config = useRuntimeConfig();
const localePath = useLocalePath();

function checkUserLogin() {
  if (route.fullPath.includes("profile")) {
    const sentryEnv = config.public.SENTRY_ENV as CookieMetaKeys;
    const tokenName = cookieMeta[sentryEnv].name;
    const bearer = useCookie(tokenName)?.value;
    if (!userStore.$state.user || !bearer) {
      navigateTo({ path: localePath(path.auth.login), query: { next: route.fullPath } });
      // window.location.assign(`${path.auth.login}?next=${route.fullPath}`);
      userStore.SET_USER(null);
    } else {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
}

onMounted(() => checkUserLogin());
onBeforeUpdate(() => checkUserLogin());
</script>

<style lang="scss" scoped>
.page-loader {
  display: flex;
  align-items: center;
  min-height: 70vh;
}

.account__wrap {
  min-height: 496px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: $color-border-pre-dark-secondary;
  @include media-breakpoint-down("lg") {
    padding-top: 0px;
  }
  @include media-breakpoint-up("sm") {
    min-height: 640px;
  }
}

.container {
  @include media-breakpoint-down("md") {
    max-width: initial;
    padding: 0;
  }
}

.account {
  display: grid;
  grid-template-areas:
    "nav content"
    "metatrader content"
    "links content";
  grid-template-columns: minmax(220px, 300px) 1fr;
  grid-auto-flow: row;

  gap: 30px;
  align-items: flex-start;
  @media (max-width: 1339px) {
    column-gap: 20px;
  }
  @include media-breakpoint-down("lg") {
    grid-template-areas:
      "nav nav"
      "content content"
      "metatrader links";
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }
  @include media-breakpoint-down("md") {
    grid-template-areas:
      "nav"
      "content"
      "metatrader"
      "links";
    grid-template-columns: 1fr;
    row-gap: 10px;
  }

  &-metatrader {
    position: relative;
    grid-area: metatrader;
    padding: 24px 0 30px 30px;
    background-color: $color-white;

    @include media-breakpoint-down("md") {
      margin: 0 10px;
    }

    &-title {
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 400;
      line-height: 140%;

      @media (max-width: 1339px) {
        font-size: 14px;
        font-weight: 700;
        line-height: 145%;
      }

      @media (max-width: 1024px) {
        margin-bottom: 20px;
      }

      @include media-breakpoint-down("md") {
        font-size: 24px;
        font-weight: 400;
        line-height: 140%;
      }
    }

    &-logo {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background-color: $slider-bg;
      border-radius: 0px 0px 0px 16px;
    }

    &-links {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      font-size: 15px;
      font-weight: 400;
      line-height: 145%;
      color: $color-primary;

      @media (max-width: 1339px) {
        font-size: 12px;
        font-weight: 500;
      }
    }

    &-link {
      display: flex;
      column-gap: 10px;
      align-items: flex-end;
    }
  }

  &-links {
    display: flex;
    flex-direction: column;
    grid-area: links;
    row-gap: 10px;
    padding: 30px 0px 30px 30px;
    color: $color-grey;
    background-color: $color-white;
    @include media-breakpoint-down("md") {
      flex-direction: row;
      column-gap: 10px;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  }
  &-content {
    grid-area: content;
    background-color: $color-white;
    border-top: 3px solid $color-primary-pre-light;
    @media (min-width: 1340px) {
      grid-row: 1 / 5;
    }
    @media (min-width: 1024px) and (max-width: 1339px) {
      grid-row: 1 / 5;
    }
    @include media-breakpoint-down("md") {
      border-top: 0;
    }
  }
}
.chevron,
.chevron-md {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 4px;
}
.chevron {
  left: -6px;
  margin-top: 6px;
  background: $color-border-pre-dark-secondary;
  transform: rotate(-45deg);
}
.chevron-md {
  top: 0;
  left: 50%;
  margin-top: -6px;
  background: $color-white;
  transform: translateX(-50%);
}
</style>
