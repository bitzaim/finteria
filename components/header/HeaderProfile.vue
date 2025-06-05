<template>
  <WithSpinner :class="{ invisible: isFetching }" inline>
    <HeaderProfileAuth v-if="isAuth" @close="emits('close')" />

    <div v-else class="profile header__profile">
      <NuxtLink class="profile__login" :to="localePath('/login')" no-prefetch>
        <span class="profile__hidden-login">{{ $t("header.btns.login") }}</span>
      </NuxtLink>

      <NuxtLink :to="localePath('/sign-up')" class="button button_yellow profile__sign-up" no-prefetch>
        {{ $t("header.btns.signup") }}
      </NuxtLink>
    </div>
  </WithSpinner>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";

import HeaderProfileAuth from "@/components/header/HeaderProfileAuth.vue";
import WithSpinner from "@/components/WithSpinner.vue";

const localePath = useLocalePath();
const emits = defineEmits(["close"]);
const isFetching = ref(true);
const store = useUserStore();
const isAuth = computed(() => store.isAuth);
onMounted(() => {
  isFetching.value = store.isFetching;
});
watch(
  () => store.isFetching,
  (newVal) => {
    isFetching.value = newVal;
  }
);

const { optionsPlatformURL } = useDomain();
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";
.header__profile {
  position: relative;
  display: flex;
  align-items: center;
  padding: 14px 0px;
  margin-left: auto;
  font-weight: 700;

  @include media-breakpoint-down("sm") {
    padding: 10px 0px;
    margin-left: inherit;
  }

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
  left: 0;
  z-index: 10;
  width: 100%;
  background: $color-white;
  border-top: 1px solid $color-primary;
  box-shadow: 0px 0px 10px 0px $color-border-light;

  @include media-breakpoint-down("sm") {
    position: static;
    display: flex;
    justify-content: space-between;
    background: $color-transparent;
    box-shadow: none;
  }
}

.header__profile__btn {
  cursor: pointer;
  @include media-breakpoint-down("sm") {
    display: none;
  }
}

.header__dropMenu-link {
  display: block;
  width: 100%;
  padding: 6px 16px;
  font-weight: 400;
  text-align: left;
  background: $color-transparent;
  border: none;

  @include media-breakpoint-down("sm") {
    padding: 6px 20px;

    &:hover {
      background: $color-primary-dark;
      background: red;
    }
  }
}

.profile__login {
  position: relative;
  padding-left: 30px;
  color: $color-text-dark;

  @include media-breakpoint-down("sm") {
    padding-left: 25px;
  }
}

.profile__login::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 16px;
  height: 16px;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.3346 14V12.6667C13.3346 11.9594 13.0537 11.2811 12.5536 10.781C12.0535 10.281 11.3752 10 10.668 10H5.33464C4.62739 10 3.94911 10.281 3.44902 10.781C2.94892 11.2811 2.66797 11.9594 2.66797 12.6667V14' stroke='%23FB7C20' stroke-width='1.66667' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M7.9987 7.33333C9.47146 7.33333 10.6654 6.13943 10.6654 4.66667C10.6654 3.19391 9.47146 2 7.9987 2C6.52594 2 5.33203 3.19391 5.33203 4.66667C5.33203 6.13943 6.52594 7.33333 7.9987 7.33333Z' stroke='%23FB7C20' stroke-width='1.66667' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%);

  @include media-breakpoint-up("sm") {
    width: 24px;
    height: 24px;
  }
}

.profile__hidden-login {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: auto;
  clip-path: none;
}

.profile__sign-up {
  padding: 7px 10px 8px;
  margin-left: 20px;
  font-size: 12px;
  color: $color-text-dark;
  letter-spacing: 0;
  border-radius: 4px;

  @include media-breakpoint-up("sm") {
    font-size: 14px;
  }
  @include media-breakpoint-down("sm") {
    margin-left: 12px;
  }
}
</style>
