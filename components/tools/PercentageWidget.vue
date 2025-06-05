<template>
  <div class="percentage-widget">
    <div class="percentage-widget__main-info">
      <div class="percentage-widget__ticker-wrapper">
        <img
          v-if="data.tool"
          class="percentage-widget__ticker-icon"
          :src="`/icons/${data.tool.type}/${getTickerBeforeSlash(data.tool.ticker)}.svg`"
          :alt="data.tool.ticker"
          width="50"
          height="50"
        />

        <span class="percentage-widget__ticker">{{ data.tool?.ticker }}</span>
        <span class="percentage-widget__ticker-display">{{ data.tool?.display_name }}</span>
      </div>

      <div class="percentage-widget__price-info">
        <p class="percentage-widget__price">{{ data.perfomance.price }} USD</p>
        <p
          class="percentage-widget__difference"
          :class="{
            'percentage-widget__difference_negative': Number(diffPercentage) < 0,
          }"
        >
          {{ diffPrice }} ({{ differenceFormatted }})
        </p>
      </div>

      <button
        v-if="isUserAuth && data.tool"
        class="button button_small button_yellow percentage-widget__trade-now"
        @click="onTradeClick(data.tool.ticker)"
      >
        {{ $t("cryptocurrency.tradeNow") }}
      </button>

      <NuxtLink
        v-else-if="data.tool"
        class="button button_small button_yellow percentage-widget__trade-now"
        :to="`${optionsPlatformURL}?instrument=${data.tool.ticker}`"
        target="_blank"
      >
        {{ $t("cryptocurrency.tradeNow") }}
      </NuxtLink>
    </div>

    <table class="percentage-widget__table">
      <thead>
        <tr>
          <th class="percentage-widget__table-head">{{ $t("markets.periods.1hour") }}</th>
          <th class="percentage-widget__table-head">{{ $t("markets.periods.24hours") }}</th>
          <th class="percentage-widget__table-head">{{ $t("markets.periods.7days") }}</th>
          <th class="percentage-widget__table-head">{{ $t("markets.periods.14days") }}</th>
          <th class="percentage-widget__table-head">{{ $t("markets.periods.30days") }}</th>
          <th class="percentage-widget__table-head">{{ $t("markets.periods.1year") }}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td
            v-for="(value, key) in data.perfomance.changes_percent"
            :key="key"
            class="percentage-widget__table-column"
            :class="{
              'percentage-widget__table-column_negative': Number(value) < 0,
            }"
          >
            {{ getChangesPercentFormatted(value) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { redirectToDefaultProfilePlatform } from "@/services/helpers";
import { getDifferenceFormatted, getTickerBeforeSlash } from "@/utils/tools";
import { ToolWithPerfomance } from "@/services/types/tools.type";
import { useDomain } from "@/composition/useDomain";

const props = defineProps<{
  data: ToolWithPerfomance;
}>();
const userStore = useUserStore();
const isUserAuth = computed<boolean>(() => userStore.isAuth);
const { optionsPlatformURL } = useDomain()

const diffPercentage = computed<string>(() => {
  return Number(props.data.perfomance.changes_percent["24h"]).toFixed(2);
});

const diffPrice = computed<string>(() => {
  const number = (Number(props.data.perfomance.price) * Number(diffPercentage.value)) / 100;
  const numberFixed = number.toFixed(2);

  return getDifferenceFormatted(numberFixed, false);
});

const differenceFormatted = computed<string>(() => {
  return getDifferenceFormatted(diffPercentage.value);
});

const getChangesPercentFormatted = (value: string | number): string => {
  const fixedValue = Number(value).toFixed(2);

  return getDifferenceFormatted(fixedValue);
};

const onTradeClick = async (tool: string) => {
  try {
    await redirectToDefaultProfilePlatform({ instrument: tool, mock: true });
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped lang="scss">
.percentage-widget {
  box-sizing: border-box;
  display: grid;
  row-gap: 20px;
  padding: 40px 20px 30px;
  background-color: $color-primary-light-trade;
  border-top: 3px solid $color-primary-pre-light;

  @include media-breakpoint-up("md") {
    row-gap: 50px;
    padding: 40px;
  }

  @include media-breakpoint-up("xl") {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    column-gap: 140px;
  }
}

.percentage-widget__main-info {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  align-items: center;

  @include media-breakpoint-up("md") {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 172px;
    column-gap: 40px;
  }
}

.percentage-widget__ticker-wrapper {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 50px 1fr;
  column-gap: 20px;
  align-items: center;

  @include media-breakpoint-up("md") {
    grid-template-columns: 70px 1fr;
  }
}

.percentage-widget__ticker-icon {
  grid-row: 1 / 3;
  width: 50px;
  height: 50px;

  @include media-breakpoint-up("md") {
    width: 70px;
    height: 70px;
  }
}

.percentage-widget__ticker {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: $color-primary-hover;

  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}

.percentage-widget__ticker-display {
  margin-top: 2px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: $color-grey;

  @include media-breakpoint-up("md") {
    font-size: 18px;
  }
}

.percentage-widget__price {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  text-align: right;

  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}

.percentage-widget__difference {
  margin-top: 2px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: $color-green-light;
  text-align: right;

  @include media-breakpoint-up("md") {
    font-size: 18px;
  }
}

.percentage-widget__difference_negative {
  color: $color-danger;
}

.percentage-widget__trade-now {
  grid-column: 1 / 3;
  width: 100%;
  padding-top: 15px;
  padding-bottom: 15px;
  line-height: 1.4;
  text-transform: uppercase;
  border-radius: 3px;

  @include media-breakpoint-up("md") {
    grid-column: auto;
    padding: 18px 0;
    font-size: 24px;
    text-transform: none;
    letter-spacing: 0;
  }
}

.percentage-widget__table {
  @include media-breakpoint-up("xl") {
    grid-row: 2 / 3;
  }
}

.percentage-widget__table-head,
.percentage-widget__table-column {
  font-size: 9px;
  font-weight: 400;
  line-height: 1.3;
  text-align: center;

  @include media-breakpoint-up("md") {
    font-size: 14px;
    line-height: 1.45;
  }
}

.percentage-widget__table-head {
  padding: 5px 0 6px;
  color: $color-grey;
  border-top: 1px solid $color-border-light;

  @include media-breakpoint-up("md") {
    padding: 9px 0 11px;
  }
}

.percentage-widget__table-column {
  padding: 6px 0;
  color: $color-green-light;
  background-color: $color-white;

  @include media-breakpoint-up("md") {
    padding: 10px 0;
    font-weight: 700;
  }
}

.percentage-widget__table-column_negative {
  color: $color-danger;
}

.percentage-widget__table-column:not(:last-child) {
  border-right: 2px solid $color-primary-light-trade;
}
</style>
