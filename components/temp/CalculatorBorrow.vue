<template>
  <div class="calculator">
    <div class="row align-items-end mb-2">
      <div class="col">
        <p class="mb-0 calculator__field-title">{{ $t(`borrow.calculator.firstTitle`) }}</p>
      </div>
      <div class="col-auto">
        <p class="mb-0 text-uppercase calculator__count_rate_usd">{{ count_rate_usd }} usd</p>
      </div>
    </div>
    <div class="calculator__row mb-4">
      <div class="row">
        <div class="col-auto">
          <SelectUI2
            :select-list="state.loan_currencies"
            :selectedItem="state.selected_loan"
            @update:selectedItem="changeCurrency($event, true)"
            isIcons
          />
        </div>
        <div class="col-auto ms-auto">
          <input
            class="calculator__input"
            type="text"
            v-model.number="state.loan_amount"
            @input="inputCurrency(true)"
          />
        </div>
      </div>
    </div>

    <p class="mb-2 calculator__field-title">{{ $t(`borrow.calculator.secondTitle`) }}</p>
    <div class="calculator__row">
      <div class="row">
        <div class="col-auto">
          <SelectUI2
            :value="state.selected_collateral"
            @update:selectedItem="changeCurrency($event, false)"
            :selectList="state.collateral_currencies"
            :selectedItem="state.selected_collateral"
            isIcons
          />
        </div>
        <div class="col-auto ms-auto">
          <input
            class="calculator__input"
            type="text"
            v-model="state.collateral_amount"
            @input="inputCurrency(false)"
          />
        </div>
      </div>
    </div>

    <div class="calculator__footer">
      <div class="row">
        <div class="col">
          <p>{{ $t(`borrow.calculator.loan_to_value`) }}</p>
        </div>
        <div class="col-auto">
          <p class="color-orange2">{{ state.ltv }}%</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p>{{ $t(`borrow.calculator.dailyInterest`) }}</p>
        </div>
        <div class="col-auto">
          <p class="color-orange2">{{ daily_rate }}% ({{ count_daily_rate_usd }} USD)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SelectUI2 from "@/components/base/BaseSelect/BaseSelect.vue";
import { computed, reactive } from "vue";
import { trimNumberBitzaim } from "@/utils/processNumbers";
import profile from "@/services/profile";

const state = reactive({
  loan_currencies: [],
  selected_loan: null,
  loan_amount: 10000,

  collateral_currencies: [],
  selected_collateral: null,
  collateral_amount: 0,

  ltv: null,
  daily_rate: null,
  daily_interest: null,

  conversion_rate: 0,
  conversion_rate_usd: 0,
});

async function getCurrencies() {
  const { data } = await profile.fetchCurrenciesBorrow();
  state.loan_currencies = data.data.loan_currencies;
  state.collateral_currencies = data.data.collateral_currencies;

  state.selected_loan = state.loan_currencies.find((item) => item.code === "usdt");
  state.selected_collateral = state.collateral_currencies.find((item) => item.code === "btc");
}

onMounted(async () => {
  try {
    await calculateCurrencies(true);
  } catch (error) {
    console.log(error);
  }
});

function changeCurrency(val, isLoan) {
  val = Object.assign({}, val);

  if (isLoan) {
    state.selected_loan = state.loan_currencies.find((item) => item.code === val.code);
  } else {
    state.selected_collateral = state.collateral_currencies.find((item) => item.code === val.code);
  }

  //проверка на совпадение
  if (state.selected_loan.code === state.selected_collateral.code) {
    let indexA;
    let currencies = isLoan ? "collateral_currencies" : "loan_currencies";
    let selected_currency = isLoan ? "selected_loan" : "selected_collateral";
    let selected_diff_currency = isLoan ? "selected_collateral" : "selected_loan";

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

  calculateCurrencies(true);
}

async function calculateCurrencies(isLoan) {
  const course = await profile.calculateCurrenciesBorrow({
    loan_currency: state.selected_loan?.code,
    collateral_currency: state.selected_collateral?.code,
  });
  const { data } = course.data;

  state.ltv = data.ltv;
  state.daily_rate = data.daily_rate;
  state.conversion_rate_usd = Number(data.conversion_rate_usd).toFixed(2);
  state.conversion_rate = trimNumberBitzaim(Number(data.conversion_rate));
  inputCurrency(isLoan);
}

function inputCurrency(isLoan) {
  if (isLoan) {
    state.collateral_amount = trimNumberBitzaim(Number(state.loan_amount / state.conversion_rate));
  } else {
    state.loan_amount = trimNumberBitzaim(Number(state.collateral_amount * state.conversion_rate));
  }
}
const daily_rate = computed(() => state.daily_rate * 100);
const count_rate_usd = computed(() => (state.conversion_rate_usd * state.loan_amount).toFixed(2));
const count_daily_rate_usd = computed(() => ((count_rate_usd.value / 100) * daily_rate.value).toFixed(2));
await getCurrencies();
</script>

<style lang="scss" scoped>
.calculator {
  padding: 60px;
  background-color: $color-white;
  border-top: 3px solid $color-primary-pre-light;
  @include media-breakpoint-down("lg") {
    padding: 40px 20px 20px;
    margin-top: 30px;
  }
  &__field-title {
    font-size: 24px;
    font-weight: 400;
    line-height: 140%;
  }
  &__row {
    position: relative;
    box-sizing: border-box;
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
</style>
