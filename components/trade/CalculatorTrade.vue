<template>
  <div class="calculator">
    <h2 class="calculator__title">{{ $t(`trade.calculator.title`) }}</h2>
    <div class="calculator__top">
      <div class="calculator__row calculator__row_center">
        <span class="calculator__currency">
          <img class="calculator__icon" :src="`/icons/${state.cryptoCurr}.svg`" />
          {{ state.cryptoCurr }}
        </span>
        /
        <span class="calculator__currency">
          <img class="calculator__icon" :src="`/icons/${state.fiatCurr}.svg`" />
          {{ state.fiatCurr }}
        </span>
      </div>

      <div class="calculator__currency">${{ localedPrice }}</div>

      <div class="calculator__daily-change">{{ $t(`trade.calculator.dailyChange`) }}: {{ state.percent }}%</div>
    </div>

    <TradeGraphic v-if="state.points" class="calculator__charts" :items="state.points" />

    <div class="calculator__row">
      <div class="calculator__range-wrap">
        <p>{{ $t(`trade.calculator.investment`) }}, $</p>
        <InputRange :value="state.range" :max="20000" :min="1000" :step="500" @change="inputRange($event)" />
      </div>

      <input type="text" class="calculator__input" v-model="state.range" />
    </div>

    <div class="calculator__leverage">
      {{ $t(`trade.calculator.leverage`) }}:
      <span class="darkorange">х{{ state.leverage }}</span>
    </div>
    <div class="calculator__row align-items-center">
      {{ $t(`trade.calculator.tradeSize`) }}: ${{ tradeSize }}

      <div class="calculator__profit">
        {{ $t(`trade.calculator.profit`) }}:
        <span class="darkorange">
          <b>${{ localedProfit }}</b>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import TradeGraphic from "./TradeGraph.vue";
import InputRange from "./InputRange.vue";

import { computed, reactive } from "vue";
import { trimNumber } from "~~/utils/processNumbers";
import { getCalculatorTradeData } from "@/services/currency";
const state = reactive({
  range: 5000,
  leverage: null,
  cryptoCurr: "",
  fiatCurr: "",
  percent: null,
  price: null,
  points: [],
});

const profit = computed(() => trimNumber((state.range / 100) * state.percent * state.leverage));
const localedProfit = computed(() => new Intl.NumberFormat("ru-RU").format(profit.value));
const price = computed(() => trimNumber(state.price));
const localedPrice = computed(() => new Intl.NumberFormat("ru-RU").format(price.value));
const tradeSize = computed(() => new Intl.NumberFormat("ru-RU").format(state.leverage * state.range));

const { data: calculatorData } = await getCalculatorTradeData();

const prerenderCalculatorData = () => {
  const data = calculatorData;
  if (data) {
    state.leverage = Number(data.leverage);
    state.percent = Number(data.percent);
    state.price = Number(data.price);
    state.cryptoCurr = data.pair.split("/")[0];
    state.fiatCurr = data.pair.split("/")[1];
    state.points = [...data.ohlc.filter((item, index) => !((index + 1) % 3))];
  }
};

function inputRange(val) {
  state.range = val;
}

prerenderCalculatorData();
</script>

<style lang="scss" scoped>
.calculator {
  max-width: 520px;
  padding: 60px;
  background-color: $color-white;
  border-top: 3px solid $color-primary;
  @include media-breakpoint-down("xl") {
    padding-right: 20px;
    padding-left: 20px;
  }
  @include media-breakpoint-down("lg") {
    max-width: 340px;
  }
  @include media-breakpoint-down("md") {
    max-width: inherit;
    padding-top: 30px;
    background: $color-primary-light-trade;
  }
}

.calculator__title {
  margin-bottom: 30px;
  font-size: 36px;
  font-weight: 500;
  @include media-breakpoint-down("md") {
    font-size: 22px;
    text-align: center;
  }
}

.calculator__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}

.calculator__row_center {
  align-items: center;
}

.calculator__range-wrap {
  flex-grow: 1;
}

.calculator__top {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  @include media-breakpoint-down("md") {
    justify-content: center;
  }
}

.calculator__charts {
  margin-top: 20px;
  margin-bottom: 20px;
}

.calculator__input {
  width: fit-content;
  max-width: 80px;
  padding: 10px 16px;
  text-align: center;
  border: 1px solid $color-disable-light;
  border-radius: 4px;
}

.calculator__leverage {
  margin-top: 24px;
}

.calculator__profit {
  font-size: 24px;
  @include media-breakpoint-down("lg") {
    width: 100%;
  }
}

.calculator__daily-change {
  font-size: 15px;
  font-weight: 400;
  line-height: 145%;
  color: $color-grey;
}

.calculator__currency {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 800;
  line-height: 140%;
  text-transform: uppercase;
}

.calculator__icon {
  width: auto;
  height: 20px;
  margin-right: 5px;
}
</style>
