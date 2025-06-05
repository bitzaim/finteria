<template>
  <AccountWrap>
    <AccountWrapSubPage
      :label="$t(`account.nav.loans`)"
      with-go-back
      @go-back="navigateTo(localePath(path.account.loans.list))"
    >
      <AppLoader v-if="isReady" class="mt-5" />

      <div class="create-loan" v-show="!isReady">
        <div class="create-loan__actions">
          <LoanActionBlock
            v-if="state.loan_currency"
            :currencyList="loanListWithBalance"
            :currentCurrency="state.loan_currency"
            :inputValue="buffer.loan_amount"
            :disabled="!!state.id"
            @update:currenctCurrency="updateCurrency('loan', $event)"
            @update:inputValue="updateAmount('loan_amount', $event)"
            :available="state.loan_currency.balance"
            with-balance
            :error="inputLoanError"
          >
            Loan Amount
          </LoanActionBlock>

          <LoanActionBlock
            v-if="state.collateral_currency"
            :currencyList="collateralListWithBalance"
            :currentCurrency="state.collateral_currency"
            :inputValue="buffer.collateral_amount"
            :disabled="!!state.id"
            @update:currenctCurrency="updateCurrency('collateral', $event)"
            @update:inputValue="updateAmount('collateral_amount', $event)"
            with-balance
            :available="state.collateral_currency.balance"
            :error="inputCollateralError"
            >Collateral Amount
          </LoanActionBlock>

          <div class="ltv">
            <h2 class="create-loan__title">Loan-to-Value (LTV)</h2>
            <div class="ltv-row">
              <label
                v-for="(item, key) in state.loan_currency?.loan_offer?.levels"
                :key="key"
                :for="'ltv' + key"
                :class="['ltv__item', { 'ltv__item--active': item.ltv === state.ltv }]"
              >
                <input v-model="state.ltv" type="radio" name="ltv" :value="item.ltv" :id="'ltv' + key" />
                {{ item.ltv }}%
              </label>
            </div>
          </div>
        </div>

        <div class="create-loan__info" v-if="loanQuote">
          <CreateLoanInfo :loan-quote="loanQuote" />

          <BaseButton
            class="create-loan__get-button"
            :disabled="!state.policy || isLoading"
            :is-loading="isLoading"
            @click="execute"
          >
            Get Loan ({{ timerCount }})
          </BaseButton>
        </div>
      </div>
    </AccountWrapSubPage>
  </AccountWrap>
</template>

<script setup>
import AccountWrap from "@/components/account/AccountWrap.vue";
import AccountWrapSubPage from "@/components/account/AccountWrapSubPage.vue";
import LoanActionBlock from "@/components/account/loans/LoanActionBlock.vue";
import CreateLoanInfo from "@/components/account/loans/CreateLoanInfo.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import profile from "@/services/profile";
import { computed, ref, reactive, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "@/library/vue-toast";
import { trimFloatNumber } from "@/utils/processNumbers";
import { useWalletsStore } from "@/stores/userWallets";
import { debounce } from "@/utils/debounce";
import { useTimerUtil } from "@/composition/useTimerUtil";
import { path } from "@/constants/routes";
import { navigateTo } from "nuxt/app";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

const $toast = useToast();
const walletsStore = useWalletsStore();

const { timerCount, timerStop, timerInit } = useTimerUtil();

const isReady = ref(true);
const isLoading = ref(false);
const localePath = useLocalePath();

const state = reactive({
  currency_list_loan: [],
  currency_list_collateral: [],
  loan_currency: false,
  loan_amount: null,
  collateral_currency: false,
  collateral_amount: null,
  ltv: null,
  rate: null,
  id: null,
  expire_at: null,
  expire_seconds: null,
  policy: true,
});

const buffer = reactive({
  loan_amount: null,
  collateral_amount: null,
  direction: "",
});

const loanQuote = ref(null);

const HIGH_PRIOR_LOAN_COINS = ["usdt", "usdc", "dai"];
// loans List is customly sorted (USDT, USDC, DAI) on the top
const loanListWithBalance = computed(() => {
  const withBalance = state.currency_list_loan.map((currency) => {
    const userWallet = walletsStore.wallets.find((wallet) => wallet.currency.code === currency.code);
    return {
      ...currency,
      balance: userWallet ? userWallet.balance : 0,
    };
  });
  const highPriorCoins = withBalance.filter((currency) => HIGH_PRIOR_LOAN_COINS.includes(currency.code));
  const output = [
    ...highPriorCoins,
    ...withBalance.filter((currency) => !HIGH_PRIOR_LOAN_COINS.includes(currency.code)),
  ];
  return output;
});

const collateralListWithBalance = computed(() => {
  return state.currency_list_collateral.map((currency) => {
    let userWallet = walletsStore.wallets.find((wallet) => wallet.currency.code === currency.code);
    return {
      ...currency,
      balance: userWallet ? userWallet.balance : 0,
    };
  });
});

const inputLoanError = computed(() => {
  if (buffer.loan_amount !== null) {
    const max = state.loan_currency.loan_offer.max_amount;
    const min = state.loan_currency.loan_offer.min_amount;
    if (!isFinite(buffer.loan_amount)) return `Value must be a number`;
    else {
      if (Number(buffer.loan_amount) > Number(max)) {
        return `Maximum ${trimFloatNumber(max)}`;
      } else if (Number(buffer.loan_amount) < Number(min)) {
        return `Minimum ${min}`;
      }
      return false;
    }
  }
});

const inputCollateralError = computed(() => {
  if (state.collateral_amount !== null) {
    if (!isFinite(state.collateral_amount)) return `Value must be a number`;
    return false;
  }
});

function updateAmount(name, val) {
  const anotherAmount = name === "loan_amount" ? "collateral_amount" : "loan_amount";

  buffer[name] = trimFloatNumber(val);
  buffer[anotherAmount] = null;
  buffer.direction = name;

  state[name] = val;
  state[anotherAmount] = null;
  debounceCreateLoan();
}

function updateCurrency(name, val) {
  const anotherName = name === "loan" ? "collateral" : "loan";
  const currency = name + "_currency";
  const anotherCurrency = anotherName + "_currency";
  const amount = name + "_amount";
  const anotherAmount = anotherName + "_amount";
  if (val.id === state[anotherCurrency].id) {
    const anotherList = collateralListWithBalance.value;
    const oldCurrency = anotherList.find((cur) => cur.code === state[currency].code);
    if (!oldCurrency) {
      throw new Error("Can't find the old currency from currency list");
    }
    state[anotherCurrency] = oldCurrency;
  }
  state[currency] = val;
  state[anotherAmount] = null;
  buffer[anotherAmount] = null;

  updateAmount(amount, state[currency]?.loan_offer?.min_amount);
  state.ltv = state.loan_currency?.loan_offer?.levels[0].ltv;
  debounceCreateLoan();
}

async function fetchCurrencies() {
  const { data } = await profile.fetchLoanCurrencies();
  state.currency_list_loan = data.loan_currencies;
  state.currency_list_collateral = data.collateral_currencies;
  state.loan_currency = loanListWithBalance.value.find((currency) => currency.code === "usdt");
  state.collateral_currency = collateralListWithBalance.value.find((currency) => currency.code === "btc");
  state.ltv = state.loan_currency?.loan_offer?.levels[0].ltv;
}

async function createLoanQuote() {
  if ((+state.loan_amount || +state.collateral_amount) && !inputLoanError.value && !inputCollateralError.value) {
    try {
      isLoading.value = true;
      timerStop();
      const { data } = await profile.createLoanQuote({
        ltv: state.ltv,
        loan_currency: state.loan_currency.code,
        collateral_currency: state.collateral_currency.code,
        [buffer.direction]: state[buffer.direction],
      });
      buffer.collateral_amount = data.collateral_amount;
      buffer.loan_amount = data.loan_amount;
      loanQuote.value = data;

      timerInit(state.expire_seconds, loanQuote.value.expire_at, createLoanQuote);
    } catch (e) {
      $toast.warning(e?.response?._data?.message, { position: "top-right" });
      console.log(e?.response?._data);
    } finally {
      isLoading.value = false;
    }
  }
}

async function execute() {
  try {
    const { data } = await profile.executeLoanQuote({ quote_id: loanQuote.value.id });
    console.log(data);
    timerStop();
    navigateTo(localePath(path.account.loans.loan + `?id=${data.id}`));
  } catch (e) {
    $toast.warning(e?.response?._data?.message, { position: "top-right" });
    console.log(e);
  } finally {
  }
}

const debounceCreateLoan = debounce(() => createLoanQuote(), 1000);

async function init() {
  try {
    await walletsStore.FETCH_WALLETS();
    await fetchCurrencies();
    updateAmount("loan_amount", state.loan_currency?.loan_offer?.min_amount);
  } catch (e) {
    console.log(e);
  } finally {
    isReady.value = false;
  }
}

onMounted(() => {
  init();
});

onUnmounted(() => timerStop());

watch(
  () => state.ltv,
  () => {
    debounceCreateLoan();
  }
);
</script>

<style scoped lang="scss">
.create-loan {
  display: flex;
  gap: 30px;
  @include media-breakpoint-up("md") {
    padding: 0 30px 30px 30px;
  }
  padding: 0 10px 10px 10px;
  @include media-breakpoint-down("xl") {
    flex-direction: column;
  }

  &__get-button {
    max-width: 380px;
    @include media-breakpoint-down("sm") {
      max-width: 100%;
      height: 50px;
      font-size: 14px;
      text-transform: uppercase;
    }
  }
}

.create-loan__actions {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.create-loan__info {
  flex-grow: 1;
  @include media-breakpoint-up("xl") {
    padding: 0 30px 30px 30px;
  }
}

.create-loan__title {
  margin: 0 0 15px 0;
  font-weight: 400;
  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}
.ltv-row {
  display: flex;
}
.ltv__item {
  flex-shrink: 0;
  padding: 10px 20px;
  margin-right: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  color: $color-primary;
  cursor: pointer;
  border: 1px solid $color-disable-light;
  border-radius: 2px;
  & input[type="radio"] {
    display: none;
  }
}
.ltv__item--active {
  font-weight: 700;
  color: $color-white;
  background: $color-orange-dark;
  border-color: transparent;
}
</style>
