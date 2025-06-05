<template>
  <article class="tool-card">
    <h3 class="tool-card__title">
      {{ data.display_name }}
    </h3>

    <p class="tool-card__text">
      {{ data.description }}
    </p>

    <div class="tool-card__ticker-info">
      <img
        class="tool-card__icon"
        :src="type === 'forex' ? `/icons/forex/${iconName}.svg` : `/icons/crypto/${iconName}.svg`"
        :alt="data.display_name"
        width="40"
        height="40"
      />
      <p class="tool-card__ticker-name">{{ data.ticker_with_slash }}</p>
      <p class="tool-card__price-info">
        <span class="tool-card__current-price">{{ formatPriceComma(data.price) }}</span>
        <span
          class="tool-card__difference"
          :class="{
            'tool-card__difference_negative': diffNumber < 0,
          }"
        >
          {{ differenceFormatted }}
        </span>
      </p>
    </div>

    <button
      v-if="isUserAuth"
      class="button button_small button_yellow tool-card__trade-now"
      @click="onTradeClick(data.ticker)"
    >
      {{ $t("cryptocurrency.tradeNow") }}
    </button>

    <NuxtLink
      v-else
      class="button button_small button_yellow tool-card__trade-now"
      :to="`${optionsPlatformURL}?instrument=${data.ticker}`"
      target="_blank"
    >
      {{ $t("cryptocurrency.tradeNow") }}
    </NuxtLink>

    <NuxtLink
      class="tool-card__exchange-rate-link"
      :to="localePath(`/markets/${getTickerInKebabCase(data.ticker_with_slash)}`)"
    >
      {{ $t("cryptocurrency.see") }} {{ data.ticker_with_slash }} {{ $t("cryptocurrency.exchangeRate") }}
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { Tool } from "@/services/types/tools.type";
import { formatPriceComma } from "@/utils/price";
import { useUserStore } from "@/stores/userStore";
import { redirectToDefaultProfilePlatform } from "@/services/helpers";
import { getTickerInKebabCase } from "@/utils/tools";
import { useDomain } from "@/composition/useDomain";

const props = withDefaults(
  defineProps<{
    data: Tool;
    type?: string;
  }>(),
  {
    type: "crypto",
  }
);
const { optionsPlatformURL } = useDomain();
const localePath = useLocalePath();

const userStore = useUserStore();
const isUserAuth = computed<boolean>(() => userStore.isAuth);

const diffNumber = computed<number>(() => {
  return Number(props.data.difference_percentage);
});

const differenceFormatted = computed<string>(() => {
  return getDifferenceFormatted(diffNumber.value);
});

const iconName = computed<string | null>(() => {
  return props.data.ticker.toLowerCase();
});

const onTradeClick = async (tool: string) => {
  try {
    await redirectToDefaultProfilePlatform({ instrument: tool, mock: true });
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped lang="scss">
.tool-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 320px;
  padding: 30px 20px;
  background-color: $color-primary-light-trade;

  @include media-breakpoint-up("md") {
    height: 400px;
  }
}

.tool-card__ticker-info {
  position: relative;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 40px 1fr;
  column-gap: 10px;
  align-items: center;
  order: -1;
  padding-bottom: 20px;
  font-size: 14px;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    grid-template-columns: 60px 1fr;
    column-gap: 20px;
    padding-bottom: 30px;
    font-size: 18px;
    line-height: 1.45;
  }
}

.tool-card__ticker-info::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 120px;
  content: "";
  border-bottom: 3px solid $color-primary-pre-light;
}

.tool-card__icon {
  grid-row: 1 / 3;
  width: 40px;
  height: 40px;

  @include media-breakpoint-up("md") {
    width: 60px;
    height: 60px;
  }
}

.tool-card__ticker-name {
  margin: 0;
  font-weight: 800;
}

.tool-card__price-info {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-weight: 500;
}

.tool-card__difference {
  font-weight: 500;
  color: $color-green-light;
}

.tool-card__difference_negative {
  color: $color-danger;
}

.tool-card__title {
  margin-top: 20px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: $color-primary-hover;

  @include media-breakpoint-up("md") {
    margin-top: 26px;
    font-size: 24px;
  }
}

.tool-card__text {
  margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    margin-top: 20px;
    font-size: 14px;
  }
}

.tool-card__trade-now {
  margin-top: auto;
  letter-spacing: 0;
  border-radius: 2px;
}

.tool-card__exchange-rate-link {
  margin-top: 20px;
  font-size: 12px;
  line-height: 1.4;
  color: $color-primary;

  @include media-breakpoint-up("md") {
    font-size: 14px;
    line-height: 1.45;
  }
}
</style>
