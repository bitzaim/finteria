<template>
  <div class="calculator">
    <div class="row">
      <div class="col">
        <p class="mb-2 calculator__field-title">
          {{ $t(`exchange.calculator.firstTitle`) }}
        </p>
      </div>
      <div class="col-auto">
        <p class="mb-2 text-uppercase calculator__count_rate_usd">{{ localed_count_rate_usd }} usd</p>
      </div>
    </div>
    <div class="calculator__row mb-4">
      <div class="col-sm-auto col col-lg calculator__select me-3">
        <SelectUI2
          class="calculator__select-item"
          :selectedItem="state?.currency_from"
          @update:selectedItem="changeCurrency($event, true)"
          :selectList="state?.currencies"
          withImage
          isCrypto
        />
      </div>

      <input
        class="calculator__input color-blue"
        inputmode="decimal"
        type="text"
        v-model.number="state.from_amount"
        @input="inputCurrency(true)"
      />
    </div>
    <p class="mb-2 calculator__field-title">
      {{ $t(`exchange.calculator.secondTitle`) }}
    </p>
    <div class="calculator__row">
      <div class="col-sm-auto col col-lg calculator__select me-3">
        <SelectUI2
          class="calculator__select-item"
          :selectedItem="state.currency_to"
          @update:selectedItem="changeCurrency($event, false)"
          :selectList="state.currencies"
          withImage
          isCrypto
        />
      </div>

      <input
        class="calculator__input color-blue"
        inputmode="decimal"
        type="text"
        v-model="state.to_amount"
        @input="inputCurrency(false)"
      />
    </div>

    <div class="calculator__footer">
      <div class="row">
        <div class="col">
          <p>{{ $t(`exchange.calculator.rate`) }}</p>
        </div>
        <div class="col-auto">
          <p class="color-blue">{{ localed_conversion_rate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SelectUI2 from "@/components/base/BaseSelect/BaseSelect.vue";
import { computed, reactive } from "vue";

import { getExchangeData } from "@/services/currency";
import services from "@/services/landings";

import { trimNumber } from "~~/utils/processNumbers";
import { useToast } from "~~/library/vue-toast";

const state = reactive({
  currencies: [],
  currency_from: null,
  currency_to: null,
  from_amount: 1,
  to_amount: 0,
  conversion_rate: 0,
  conversion_rate_usd: 0,
});

const $toast = useToast();

const count_rate_usd = computed(() => trimNumber(state.conversion_rate_usd * state.from_amount));
const localed_count_rate_usd = computed(() => new Intl.NumberFormat("ru-RU").format(count_rate_usd.value));
const getCurrencies = async () => {
  const { data } = await getExchangeData();
  state.currencies = data;
  if (state.currencies) {
    state.currency_from = state.currencies.find((item) => item.code === "btc");
    state.currency_to = state.currencies.find((item) => item.code === "eth");
  }
};

async function calculate(isFirst) {
  try {
    const { data } = await services.getCalculatorExchangeData({
      currency_from: state.currency_from.code,
      currency_to: state.currency_to.code,
    });
    state.conversion_rate = trimNumber(+data.conversion_rate);
    state.conversion_rate_usd = trimNumber(+data.conversion_rate_usd);
    inputCurrency(isFirst);
  } catch (error) {
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  }
}
const localed_conversion_rate = computed(() => new Intl.NumberFormat("ru-RU").format(state.conversion_rate));
function inputCurrency(isFirst) {
  if (isFirst) {
    state.to_amount = trimNumber(state.conversion_rate * state.from_amount);
  } else {
    state.from_amount = trimNumber(state.to_amount / state.conversion_rate);
  }
}

function changeCurrency(val, from) {
  val = Object.assign({}, val);

  state[from ? "currency_from" : "currency_to"] = {};
  state[from ? "currency_from" : "currency_to"] = state.currencies.find((item) => item.code === val.code);

  //проверка на совпадение
  if (state.currency_from?.code === state.currency_to?.code) {
    let indexA;
    let currencies = "currencies";
    let selected_currency = from ? "currency_from" : "currency_to";
    let selected_diff_currency = from ? "currency_to" : "currency_from";

    state[currencies].find((item, index) => {
      if (item.code === state[selected_currency].code) indexA = index;
      return item.code === state[selected_currency].code;
    });

    if (typeof indexA == "number") {
      if (state[currencies][indexA + 1]) {
        state[selected_diff_currency] = state[currencies][indexA + 1];
      } else {
        state[selected_diff_currency] = state[currencies][indexA - 1];
      }
    }
  }

  calculate(true);
}

await getCurrencies();
await calculate(true);
</script>

<style lang="scss" scoped>
.calculator {
  padding: 60px;
  background-color: $color-white;
  border-top: 3px solid $color-primary;
  @include media-breakpoint-down("lg") {
    padding: 40px 20px 20px;
    margin-top: 30px;
  }
  @include media-breakpoint-down("md") {
    background: $color-primary-light-trade;
  }
  &__field-title {
    font-size: 24px;
    font-weight: 400;
    line-height: 140%;
    @include media-breakpoint-down("md") {
      font-size: 16px;
    }
  }
  &__row {
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border-radius: 4px;

    &:after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: calc(100% - 120px);
      height: 1px;
      content: "";
      background-color: $color-disable-light;
    }

    &--border-0 {
      &:after {
        display: none;
      }
    }
  }
  &__input {
    &-wrap {
      position: relative;
      z-index: 1;
      width: calc(100% - 120px);
      margin-top: -10px;
    }
    width: 100px;
    //width: 100%;
    height: 100%;

    padding: 10px;
    font-size: 14px;
    font-weight: 700;
    line-height: 145%;
    color: $color-text-dark;
    text-align: right;
    border: 1px solid $color-disable-light;
    border-radius: 4px;
    outline: none;
    box-shadow: none;
  }
  &__count_rate_usd {
    color: $color-grey;
    @include media-breakpoint-down("md") {
      font-size: 12px;
    }
  }

  &__footer {
    padding: 20px;
    margin-top: 30px;
    background: linear-gradient(180deg, $color-orange-lightest 0%, transparent 100%);
    border-radius: 4px;
    & p {
      margin-bottom: 0;
      font-size: 17px;
      font-weight: 700;
      line-height: 170%;
    }
  }

  //range, earn
  & .range_count {
    font-size: 20px;
    font-weight: 800;
    line-height: 140%;
    color: $color-primary;
  }
  &__bottom {
    &-title {
      @include media-breakpoint-down("md") {
        margin-bottom: 10px;
        text-align: center;
      }
    }
    &-card {
      padding: 8px 20px;
      background: $color-bg-lightest;
      border-radius: 4px;
      @include media-breakpoint-down("md") {
        padding: 5px 10px;
        font-size: 13px;
        line-height: 140%;
      }
    }
  }
}

.calculator__select {
  min-width: 105px;
}

.calculator__select-item:deep(.select__item) {
  min-width: auto;
}
</style>
