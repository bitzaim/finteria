<template>
  <AccountWrap v-if="access">
    <AppLoader v-if="isLoading" class="mt-5" />

    <AccountWrapSubPage v-if="wraps.actions && !isLoading" :label="$t(`account.nav.exchange`)" hideWhenMobile>
      <div class="exchange">
        <div class="exchange__actions">
          <div class="position-relative">
            <ActionBlock
              v-if="state.from_currency"
              :currencyList="userCurrencyList"
              :currentCurrency="state.from_currency"
              :inputValue="fromAmountView"
              :disabled="!!state.id"
              @update:currenctCurrency="updateCurrency('from', $event)"
              @update:inputValue="updateAmount('from_amount', $event)"
              :available="availableFrom"
              :error="inputError"
              with-max
              with-balance
            >
              {{ $t(`account.exchange.page.youPay`) }}
            </ActionBlock>

            <div class="exchange_currencies" @click="changeCurrencies" v-if="isChangeCurrenciesReady">
              <IconRefresh class="exchange_currencies--icon" />
            </div>
          </div>

          <ActionBlock
            v-if="state.to_currency"
            :currencyList="currencyListCalcBalance"
            :currentCurrency="state.to_currency"
            :inputValue="toAmountView"
            :disabled="!!state.id"
            @update:currenctCurrency="updateCurrency('to', $event)"
            @update:inputValue="updateAmount('to_amount', $event)"
            :available="availableTo"
            with-balance
            >{{ $t(`account.exchange.page.youGet`) }}
          </ActionBlock>

          <div v-if="!state.id">
            <BaseButton type="button" full-width :disabled="!!inputError" :is-loading="isFetching" @click="fetch">
              {{ $t("common.btns.preview") }}
            </BaseButton>
          </div>

          <div v-else>
            <div class="exchange__rate">Exchange Rate: {{ exchangeRate }}</div>

            <div class="d-flex">
              <div class="flex-grow-0 me-2">
                <BaseButton type="button" color="secondary" mobile-full-width @click="reset()">
                  {{ $t("common.btns.reset") }}
                </BaseButton>
              </div>
              <div class="flex-grow-1">
                <BaseButton type="button" full-width :disabled="!!inputError" :is-loading="isFetching" @click="execute">
                  {{ `${t("common.btns.confirm")} (${timerCount})` }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountWrapSubPage>

    <AccountWrapSubPage v-if="wraps.final && !isLoading" :label="$t(`account.nav.exchange`)">
      <ExchangeSuccess :infoData="infoBlockData" @reset="reset" />
    </AccountWrapSubPage>
  </AccountWrap>
</template>

<script setup>
import AccountWrap from "@/components/account/AccountWrap.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import AccountWrapSubPage from "@/components/account/AccountWrapSubPage.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import ActionBlock from "@/components/account/exchange/ExchangeActionBlock.vue";
import ExchangeSuccess from "@/components/account/exchange/ExchangeSuccess.vue";
import IconRefresh from "@/components/icons/IconRefresh";
import profile from "@/services/profile";
import { computed, ref, reactive } from "vue";
import { useToast } from "@/library/vue-toast";
import { trimFloatNumber } from "~~/utils/processNumbers";
import { defaultState } from "@/constants/exchange";
import { useWalletsStore } from "@/stores/userWallets";
import { useUserStore } from "@/stores/userStore";
import { path } from "~~/constants/routes";
import standardizeDate, { correctUtcFormat } from "~~/utils/standardizeDate";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

const { t } = useI18n();
const $toast = useToast();
const profileWallets = ref([]);
const isLoading = ref(true);
const isFetching = ref(false);

const walletsStore = useWalletsStore();

const wraps = reactive({
  actions: true,
  final: false,
});
const fromAmountView = computed(() => {
  return trimFloatNumber(buffer.from_amount, state.from_currency.visual_divisibility);
});
const toAmountView = computed(() => {
  return trimFloatNumber(buffer.to_amount, state.to_currency.visual_divisibility);
});
const state = reactive({
  currency_list: [],
  from_currency: false,
  from_amount: null,
  to_currency: false,
  to_amount: null,
  rate: null,
  id: null,
  expire_at: null,
});

const buffer = reactive({
  from_amount: null,
  to_amount: null,
  direction: "",
});

const timerCount = ref(0);
let timerInterval = ref(null);

function changeWrap(wrap) {
  Object.keys(wraps).forEach((item) => (wraps[item] = false));
  wraps[wrap] = true;
}

const infoBlockData = computed(() => {
  const data = { ...state };
  delete data.currency_list;
  return data;
});

const exchangeRate = computed(
  () => `1 ${state.from_currency.display_code} = ${trimFloatNumber(state.rate)} ${state.to_currency.display_code}`
);
const userCurrencyList = computed(() => {
  return profileWallets.value.map((currency) => {
    const findElement = state.currency_list.find((element) => currency.currency.code === element.code);
    return Object.assign(findElement, { balance: currency.balance });
  });
});

const currencyListCalcBalance = computed(() => {
  return state.currency_list.map((currency) => {
    let userWallet = profileWallets.value.find((wallet) => wallet.currency.code === currency.code);
    return {
      ...currency,
      balance: userWallet ? userWallet.balance : 0,
    };
  });
});

const availableFrom = computed(
  () => profileWallets.value.find((item) => item.currency.code === state.from_currency.code)?.balance
);

const availableTo = computed(() => {
  const output = profileWallets.value.find((item) => item.currency.code === state.to_currency.code);
  return output?.balance;
});

const inputError = computed(() => {
  if (state.from_amount !== null) {
    if (!isFinite(state.from_amount)) return `Value must be a number`;
    else {
      if (Number(state.from_amount) > Number(availableFrom.value)) {
        return `Maximum ${trimFloatNumber(availableFrom.value)}`;
      } else if (Number(state.from_amount) < Number(state.from_currency.min_amount)) {
        return `Minimum ${state.from_currency.min_amount}`;
      }
      return false;
    }
  }
});

const isChangeCurrenciesReady = computed(
  () => userCurrencyList.value.find((item) => item.id === state.to_currency.id) && !state.id
);

function changeCurrencies() {
  let buffer = state.from_currency;
  state.from_currency = state.to_currency;
  state.to_currency = buffer;
}

function updateAmount(name, val) {
  const anotherAmount = name === "from_amount" ? "to_amount" : "from_amount";
  buffer[name] = val;
  buffer[anotherAmount] = null;
  buffer.direction = name;

  state[name] = val;
  state[anotherAmount] = null;
}

function updateCurrency(name, val) {
  const currency = name + "_currency";
  const anotherCurrency = name === "from" ? "to_currency" : "from_currency";
  const anotherAmount = name === "from" ? "from_amount" : "to_amount";
  state[currency] = val;
  state[anotherAmount] = null;
  buffer[anotherAmount] = null;

  if (state[currency].id === state[anotherCurrency].id) {
    state[anotherCurrency] =
      state[anotherCurrency].id === state.currency_list[0].id ? state.currency_list[1] : state.currency_list[0];
  }
}

function getUtcDateNow() {
  const formattedUtcDate = correctUtcFormat();
  const processed_expire_at = standardizeDate(state.expire_at);
  const output = {
    date_expire: new Date(processed_expire_at),
    date_now: new Date(formattedUtcDate),
  };
  return output;
}

async function fetch() {
  isFetching.value = true;
  try {
    const { data } = await profile.fetchExchangeQuote({
      [buffer.direction]: state[buffer.direction],
      from_currency: state.from_currency.code,
      to_currency: state.to_currency.code,
    });
    delete data.from_currency;
    delete data.to_currency;
    buffer.from_amount = trimFloatNumber(data.from_amount);
    buffer.to_amount = trimFloatNumber(data.to_amount);
    Object.assign(state, data);
    timerInit();
  } catch (e) {
    $toast.warning(e?.response?._data?.message, { position: "top-right" });
  } finally {
    isFetching.value = false;
  }
}

function timerInit() {
  const { date_expire, date_now } = getUtcDateNow();
  timerCount.value = (date_expire - date_now) / 1000;
  timerInterval.value = setInterval(() => {
    if (timerCount.value > 0) {
      timerCount.value--;
    } else {
      timerStop();
      fetch();
    }
  }, 1000);
}

function timerStop() {
  clearInterval(timerInterval.value);
  timerCount.value = 0;
}

async function fetchWallets() {
  const { data } = await profile.getProfileWallets();
  profileWallets.value = data;
}

async function execute() {
  isFetching.value = true;
  timerStop();
  try {
    const data = await profile.executeExchangeQuote({ quote_id: state.id });
    if (data.success) $toast.success(t("common.toast.success"), { position: "top-right" });
    changeWrap("final");
  } catch (e) {
    let errorOffLimit = "Off balance limits.";
    let message = `This operation is temporarily unavailable. Please try again later.`;
    if (e?.response?._data?.message === errorOffLimit) $toast.warning(message, { position: "top-right" });
    else $toast.warning(e?.response?._data?.message, { position: "top-right" });
    await reset();
  } finally {
    isFetching.value = false;
  }
}

async function init() {
  const res = await profile.getAccountExchangeData();
  const data = res?.data;
  await fetchWallets();
  isLoading.value = false;
  state.currency_list = data.currencies;
  state.from_currency = walletsStore.exchangingCurrency ? walletsStore.exchangingCurrency : data.currencies[0];
  state.to_currency = walletsStore.exchangingCurrency
    ? data.currencies.find((cur) => cur.code !== walletsStore.exchangingCurrency?.code)
    : data.currencies[1];
  state.to_amount = null;
  walletsStore.exchangingCurrency && walletsStore.SET_EXCHANGING_CURRENCY(null);
}

async function reset() {
  Object.assign(state, defaultState);
  buffer.to_amount = null;
  changeWrap("actions");
  await fetchWallets();
  state.to_amount = null;
  timerStop();
}

const userStore = useUserStore();
const access = ref(false);
onMounted(() => {
  if (userStore.isAuth) {
    access.value = true;
    init();
  } else {
    window.location.assign(`${path.auth.login}?next=/profile/exchange`);
  }
});
</script>

<style scoped lang="scss">
.exchange {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px 10px;
  @include media-breakpoint-up("md") {
    padding: 30px;
  }
  @include media-breakpoint-up("xl") {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.exchange_currencies {
  position: absolute;
  right: 0;
  bottom: -20px;
  z-index: 10;
  display: block;
  margin-bottom: -15px;
  text-align: right;
  cursor: pointer;
}

.exchange_currencies--icon {
  z-index: 2;
  cursor: pointer;
}

.exchange__actions {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.exchange__rate {
  margin-bottom: 38px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  color: $color-grey;
}

.exchange__btn {
  width: 100%;
  max-width: 340px;
  padding: 16px;
  font-size: 16px;

  @include media-breakpoint-up("xxl") {
    grid-column: -1/1;
    justify-self: end;
  }
}
</style>
