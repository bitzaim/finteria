<template>
  <section class="intro">
    <div class="container">
      <div class="intro__wrap">
        <div class="intro__left">
          <h1 class="intro__title">
            {{ $t(`trade.landingPreview.title`) }}
          </h1>
          <p class="intro__text">{{ $t(`trade.landingPreview.subtitle`) }}</p>
          <div class="intro__advantages-wrap">
            <p class="intro__advantages intro__advantages_gift" v-html="$t(`trade.landingPreview.gift`)" />
            <p class="intro__advantages intro__advantages_student" v-html="$t(`trade.landingPreview.student`)" />
          </div>
          <div class="intro__btn-wrap">
            <button @click="tryPlatform" class="button button_yellow" id="btnTry" type="button">
              {{ $t("trade.landingPreview.btnTry") }}
            </button>
          </div>
        </div>

        <Calculator :data="calculatorData" />
      </div>

      <ul class="intro__options" :class="{ invisible: !userStore.minFirstAmount }">
        <IntroOption v-for="(option, index) in introOptionsData" :key="`options${index}`">
          <template #title>
            {{ $t(option.title, { m$sg: userStore.minFirstAmount }) }}
          </template>
          <template #text>
            {{ $t(option.text) }}
          </template>
          <template #subTitle>
            {{ $t(option.subTitle) }}
          </template>
        </IntroOption>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import IntroOption from "@/components/trade/TradeOption.vue";
import Calculator from "@/components/trade/Calculator.vue";
import { useTradeConstants } from "@/constants/trade";
import { path } from "@/constants/routes";
import { useUserStore } from "@/stores/userStore";
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";
const { introOptionsData } = useTradeConstants();

defineProps<{
  calculatorData: any;
}>();

const userStore = useUserStore();
const localePath = useLocalePath();

function tryPlatform() {
  if (userStore.user) {
    redirectToDefaultProfilePlatform({ platform_type: "options", mock: true }, false);
  } else {
    navigateTo({ path: localePath(path.auth.signUp) });
  }
}
</script>

<style scoped lang="scss">
.intro {
  position: relative;
  padding-top: 30px;
  margin-bottom: 70px;
  background-image: url("/img/landings/trade/avif/background.avif");
  background-repeat: no-repeat;
  background-position: top 5% center;
  background-size: 100%;

  @include media-breakpoint-up("md") {
    padding-top: 80px;
    margin-bottom: 80px;
    background-position: top center;
    background-size: cover;
  }
}

.page__body:not(.avif) .intro {
  background-image: url("/img/landings/trade/webp/background.webp");
}

.page__body:not(.avif):not(.webp) .intro {
  background-image: url("/img/landings/trade/background.png");
}

.intro__wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 15px;
  justify-content: space-between;
}
.intro__left {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  gap: 30px;
  // max-width: 630px;
  align-items: flex-start;
  width: 45%;
  min-width: 500px;
  @include media-breakpoint-down("xl") {
    // flex-shrink: 1;
  }
  @include media-breakpoint-down("md") {
    gap: 20px;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    text-align: center;
  }

  @include media-breakpoint-down("sm") {
    min-width: unset;
  }
}

.intro__right {
  margin-left: auto;
  @include media-breakpoint-down("md") {
    width: 100%;
  }
}

.intro__title {
  font-size: 46px;
  font-weight: 700;
  @include media-breakpoint-down("md") {
    font-size: 28px;
  }
}

.intro__text {
  font-size: 24px;
  @include media-breakpoint-down("md") {
    font-size: 16px;
  }
}

.intro__advantages-wrap {
  display: flex;
  gap: 6px;
  margin-top: 60px;
  @include media-breakpoint-down("lg") {
    flex-direction: column;
    gap: 16px;
  }
  @include media-breakpoint-down("md") {
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  @include media-breakpoint-down("sm") {
    //flex-direction: column;
    gap: 30px;
  }
}

.intro__advantages {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0;

  @include media-breakpoint-down("sm") {
    font-size: 12px;
    line-height: 140%;
    text-align: left;
  }
}

.intro__advantages::before {
  width: 40px;
  height: 40px;
  content: "";
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.intro__advantages_gift::before {
  background-image: url("/icons/gift.svg");
}

.intro__advantages_student::before {
  background-image: url("/icons/student.svg");
}

.intro__advantages-icon {
  @include media-breakpoint-down("sm") {
    width: 30px;
  }
}

.intro__advantages-img {
  height: 40px;
}

.intro__options {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;

  @include media-breakpoint-down("xl") {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @include media-breakpoint-down("sm") {
    grid-template-columns: 1fr;
  }
}

.intro__btn-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @include media-breakpoint-down("sm") {
    flex-direction: column;
    width: 100%;

    & > a {
      display: block;
    }
  }
}
</style>
