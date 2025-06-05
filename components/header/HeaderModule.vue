<template>
  <div class="header__module">
    <h3 class="header__module__title">{{ $t(module.label) }}</h3>
    <template v-for="(link, index) in module.links" :key="`headerLink${index}`">
      <template v-if="link.name === 'header.menu.platforms.web'">
        <button
          v-if="isAuth"
          class="header__module__link"
          @click.stop="redirectToDefaultProfilePlatform({ platform_type: 'options' }, false)"
        >
          {{ $t(link.name) }}
        </button>
        <a
          v-else
          class="header__module__link"
          :href="link.link"
          target="_blank"
        >
          {{ $t(link.name) }}
        </a>
      </template>

      <template v-else>
        <a v-if="link.target" class="header__module__link" :href="link.link" :target="link.target">{{ $t(link.name) }}</a>
        <a v-else-if="link.hash" class="header__module__link" :href="`${localePath(link.link)}${link.hash}`">
          {{ $t(link.name) }}
        </a>
        <NuxtLink v-else class="header__module__link" :to="localePath(link.link)" @click="close" no-prefetch>
          {{ $t(link.name) }}
        </NuxtLink>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/stores/userStore";
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";

defineProps({ module: { type: Object, required: true } });

const emits = defineEmits(["close"]);

const userStore = useUserStore();
const isAuth = computed(() => userStore.isAuth)

const close = () => {
  emits("close");
};

const localePath = useLocalePath();
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";

.header__module {
  padding: 20px 0px;
  @include media-breakpoint-down("md") {
    padding: 0px;
  }

  &__link {
    display: block;
    width: 100%;
    padding: 6px 16px;
    color: $color-text-dark;
    text-align: left;
    background: $color-transparent;
    border: none;

    &:hover {
      background: $color-primary-lightest;
    }

    @include media-breakpoint-down("md") {
      color: $color-white;
    }

    @include media-breakpoint-down("sm") {
      padding: 6px 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;

      &:hover {
        background: $color-primary-dark;
      }
    }
  }

  & > .header__module__link:nth-child(2) {
    margin-top: 14px;
  }

  & > .header__module__link:last-child {
    margin-bottom: 14px;
  }
}

.header__module__title {
  padding: 6px 16px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;

  @include media-breakpoint-down("md") {
    text-transform: uppercase;
    background-color: $color-primary-pre-dark;
  }

  @include media-breakpoint-down("sm") {
    padding: 10px 20px;
    margin-bottom: 0px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.4px;
  }
}
</style>
