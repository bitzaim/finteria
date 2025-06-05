<template>
  <section class="block_blue strategy">
    <div class="container strategy__container">
      <h2 class="title strategy__title">
        {{ $t("trade.tradingExperience.title") }}
      </h2>

      <p class="subtitle strategy__subtitle">
        {{ $t("trade.tradingExperience.subtitle") }}
      </p>

      <div class="strategy__top">
        <h3 class="strategy__top-title">
          {{ $t("trade.tradingExperience.topStrategies.title") }}
        </h3>

        <TradeTable class="strategy__table" :topStrategies="topStrategies" @followStrategy="followStrategy" />
      </div>

      <ul class="strategy__options">
        <li class="strategy__option" v-for="(element, index) in strategyOptions" :key="`options${index}`">
          <h3 class="strategy__option-title">{{ $t(element.title) }}</h3>
          <p class="strategy__option-text">
            {{ $t(element.text) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TopStrategy } from "@/types/trade.type";
import TradeTable from "@/components/trade/TradeTable.vue";

import { useTradeConstants } from "@/constants/trade";
import { useUserStore } from "~~/stores/userStore";
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";
const { strategyOptions } = useTradeConstants();
const user = useUserStore();

defineProps<{
  topStrategies?: TopStrategy[];
}>();

const followStrategy = (strategy: TopStrategy) => {
  if (useRuntimeConfig().public.SHOW_PROFILE) {
    if (user.isAuth) {
      redirectToDefaultProfilePlatform({ strategyID: strategy.id }, true);
    } else {
      navigateTo({
        path: "/login",
        query: {
          platform: "default",
        },
      });
    }
  } else {
    redirectToDefaultProfilePlatform({ strategyID: strategy.id }, true);
  }
};
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";
.strategy {
  padding-top: 60px;
  padding-bottom: 30px;

  @include media-breakpoint-up("md") {
    padding-top: 120px;
    padding-bottom: 64px;
  }

  @include media-breakpoint-up("lg") {
    padding-bottom: 0;
  }
}

.strategy__container {
  @include media-breakpoint-up("lg") {
    display: grid;
    grid-template-columns: minmax(460px, 630px) minmax(400px, 468px);
    column-gap: 20px;
    justify-content: space-between;
  }

  @include media-breakpoint-up("xl") {
    grid-template-columns: 630px 518px;
  }
}

.strategy__title {
  width: 100%;
  padding-top: 20px;
  margin-bottom: 10px;
  text-align: center;

  @include media-breakpoint-up("md") {
    padding-top: 40px;
  }

  @include media-breakpoint-up("lg") {
    grid-column: 1 / 3;
  }
}

.strategy__title::after {
  left: 50%;
  max-width: 160px;
  margin-left: -80px;
}

.strategy__subtitle {
  margin-bottom: 30px;
  font-size: 16px;
  text-align: center;

  @include media-breakpoint-up("md") {
    margin-bottom: 60px;
    font-size: 24px;
  }

  @include media-breakpoint-up("lg") {
    grid-column: 1 / 3;
  }
}

.strategy__top {
  box-sizing: border-box;
  padding: 30px 20px;
  margin-bottom: 30px;
  background-color: $color-primary;

  @include media-breakpoint-up("md") {
    width: 520px;
    padding: 60px 60px 66px;
    margin: 0 auto 60px;
  }

  @include media-breakpoint-up("lg") {
    width: 100%;
    padding-right: 30px;
    padding-left: 30px;
    margin: 0;
    margin-bottom: -66px;
  }

  @include media-breakpoint-up("xl") {
    padding-right: 60px;
    padding-left: 60px;
  }
}

.strategy__top-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: 500;
  color: $color-white;

  @include media-breakpoint-up("md") {
    margin-bottom: 60px;
    font-size: 36px;
  }
}

.strategy__top-title::before {
  position: absolute;
  top: 50%;
  left: -20px;
  height: 20px;
  margin-top: -10px;
  content: "";
  border-left: 3px solid $color-orange;

  @include media-breakpoint-up("md") {
    left: -60px;
    height: 30px;
  }

  @include media-breakpoint-up("lg") {
    left: -30px;
  }

  @include media-breakpoint-up("xl") {
    left: -60px;
  }
}

.strategy__top-title::after {
  width: 40px;
  height: 40px;
  content: "";
  background-image: url("/icons/goblet.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  @include media-breakpoint-up("md") {
    width: 50px;
    height: 50px;
  }
}

.strategy__options {
  @include media-breakpoint-up("md") {
    width: 520px;
    margin: 0 auto;
  }

  @include media-breakpoint-up("lg") {
    width: 100%;
    padding-top: 60px;
    margin: 0;
  }

  @include media-breakpoint-up("xl") {
    padding-right: 50px;
  }
}

.strategy__option {
  position: relative;
  padding-left: 44px;
  margin-bottom: 20px;

  @include media-breakpoint-up("md") {
    padding-left: 60px;
    margin-bottom: 40px;
  }
}

.strategy__option::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  content: "";
  background-color: $color-orange-dark;
  background-image: url("/icons/arrow-down.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  @include media-breakpoint-up("md") {
    width: 30px;
    height: 30px;
  }
}

.strategy__option:last-child::before {
  background-image: url("/icons/accept.svg");
}

.strategy__option:not(:last-child)::after {
  position: absolute;
  top: 24px;
  left: 12px;
  width: 2px;
  height: calc(100% - 4px);
  content: "";
  background: $color-orange-dark;
  transform: translateX(-50%);

  @include media-breakpoint-up("md") {
    top: 30px;
    left: 15px;
    height: calc(100% + 10px);
  }
}

.strategy__option-title {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    margin-bottom: 10px;
    font-size: 24px;
  }
}

.strategy__option-text {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 14px;
  }
}
</style>
