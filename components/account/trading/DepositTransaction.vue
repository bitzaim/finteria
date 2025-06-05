<template>
  <BaseLoader v-if="isLoading || !tradingStore.executedInvoive.id" />
  <!-- there are 2 templates below. They shown interchangebly according to crypto_deposit field -->
  <CardUi v-else-if="cryptoDeposit" in-content>
    <div class="deposit-transaction">
      <div class="deposit-transaction-header" style="margin-bottom: 20px">
        <div class="deposit-transaction-header__left">
          <div class="deposit-transaction-header__icon">
            <IconTransactionDownload />
          </div>
          <div class="deposit-transaction-header__number">
            {{ $t(`account.trading.depositSecondPage.transaction`) }} <br />
            #{{ tradingStore.executedInvoive.id }}
          </div>
        </div>
        <div class="deposit-transaction-header__right">
          <h3 class="deposit-transaction-header__amount">
            {{ trimFloatNumber(tradingStore.executedInvoive.display_amount, 2) }}
            {{ tradingStore.executedInvoive.display_currency.toUpperCase() }}
          </h3>
          <p class="deposit-transaction-header__course">
            {{ floatAmoumt }}
            {{ tradingStore.executedInvoive.funding_currency.toUpperCase() }}
          </p>
        </div>
      </div>
      <div class="deposit-transaction-content">
        <div class="row">
          <div class="col">
            <div class="deposit-transaction-content__input-title">
              {{ $t(`account.trading.depositSecondPage.receivingAmount`) }}
            </div>
            <div class="row" v-if="cryptoDeposit.amount">
              <div class="col col-md-8 col-lg" style="width: 100%">
                <InputUI v-model="cryptoDeposit.amount" small ref="inputAmount" :readonly="true" />
              </div>
            </div>
            <div class="deposit-transaction-content__input-title">
              {{ $t(`account.trading.depositSecondPage.txid`) }}
            </div>

            <template v-if="cryptoDeposit.txid">
              <div class="row">
                <div class="col col-md-8 col-lg" style="margin-bottom: 10px">
                  <InputUI v-model="cryptoDeposit.txid" small ref="inputAddress" :readonly="true" />
                </div>
                <div class="col-auto">
                  <BaseButton type="button" color="secondary" @click="copyValue('inputAddress')">
                    {{ $t(`account.trading.depositSecondPage.copyBtn`) }}
                  </BaseButton>
                  <NuxtLink v-if="isCoinSupported" style="margin-left: 10px" :to="blockChairLink" target="_blank">
                    <BaseButton type="button" color="tertiary">
                      {{ $t(`account.trading.depositSecondPage.openInExplorer`) }}
                    </BaseButton>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <hr />

      <div class="deposit-transaction-timeblock">
        <div class="deposit-transaction-timeblock__status">
          <div class="deposit-transaction-timeblock__status-title">
            {{ $t(`account.trading.depositSecondPage.status`) }}
          </div>
          <div class="deposit-transaction-timeblock__status-text">
            {{
              cryptoDeposit.status === "in_progress"
                ? $t(`account.trading.depositSecondPage.statuses.pending`)
                : cryptoDeposit.status === "completed"
                ? $t(`account.trading.depositSecondPage.statuses.completed`)
                : cryptoDeposit.status
            }}
          </div>
        </div>
        <div class="deposit-transaction-timeblock__timer">
          <div class="deposit-transaction-timeblock__timer-circle">
            <TransactionLoader
              :pending-time="expire_timer > 0 ? expire_timer : 1"
              :completed="cryptoDeposit.status === 'completed'"
            />
          </div>
          <div class="deposit-transaction-timeblock__timer-time" v-if="cryptoDeposit.status !== 'completed'">
            <div class="deposit-transaction-timeblock__timer-counter">
              {{ time }}
            </div>
            <div class="deposit-transaction-timeblock__timer-text">
              {{ $t(`account.trading.depositSecondPage.timeInterval`) }}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div class="deposit-transaction-footer" v-if="cryptoDeposit.status !== 'completed'">
        <div
          v-if="
            te(
              `account.trading.depositSecondPage.confirmationMessages.${tradingStore.executedInvoive.funding_currency}`
            )
          "
        >
          {{
            $t(
              `account.trading.depositSecondPage.confirmationMessages.${tradingStore.executedInvoive.funding_currency}`
            )
          }}
        </div>
        <div v-else>
          {{ $t(`account.trading.depositSecondPage.confirmationMessage`) }}
        </div>
      </div>
    </div>
  </CardUi>
  <CardUi v-else in-content>
    <div class="deposit-transaction">
      <div class="deposit-transaction-header">
        <div class="deposit-transaction-header__left">
          <div class="deposit-transaction-header__icon">
            <IconTransactionDownload />
          </div>
          <div class="deposit-transaction-header__number">
            {{ $t(`account.trading.depositSecondPage.transaction`) }} <br />
            #{{ tradingStore.executedInvoive.id }}
          </div>
        </div>
        <div class="deposit-transaction-header__right">
          <h3 class="deposit-transaction-header__amount">
            {{ trimFloatNumber(tradingStore.executedInvoive.display_amount, 2) }}
            {{ tradingStore.executedInvoive.display_currency.toUpperCase() }}
          </h3>
          <p class="deposit-transaction-header__course">
            {{ floatAmoumt }}
            {{ tradingStore.executedInvoive.funding_currency.toUpperCase() }}
          </p>
        </div>
      </div>
      <div class="deposit-transaction-content">
        <div class="row">
          <div class="col-md-auto d-flex justify-content-center justify-content-md-start">
            <QrCode
              v-if="tradingStore.executedInvoive?.receive_address?.address"
              :value="tradingStore.executedInvoive?.receive_address?.address"
            />
            <BaseLoader v-else />
          </div>
          <div class="col">
            <div class="deposit-transaction-content__text">
              {{ $t(`account.trading.depositSecondPage.scanQr`) }}
            </div>
            <div class="deposit-transaction-content__input-title">
              {{ $t(`account.trading.depositSecondPage.depositAmount`) }}
            </div>
            <div class="row">
              <div class="col col-md-8 col-lg" style="margin-bottom: 10px">
                <InputUI v-model="floatAmoumt" small ref="inputAmount" :readonly="true" />
              </div>
              <div class="col-auto">
                <BaseButton type="button" color="secondary" @click="copyValue('inputAmount')">
                  {{ $t(`account.trading.depositSecondPage.copyBtn`) }}
                </BaseButton>
              </div>
            </div>
            <div
              class="deposit-transaction-content__input-title"
              v-if="tradingStore.executedInvoive?.receive_address?.type === 'rotational'"
            >
              {{ $t(`account.trading.depositSecondPage.rotationalAddress`) }}
            </div>
            <div class="deposit-transaction-content__input-title" v-else>
              {{ $t(`account.trading.depositSecondPage.depositAddress`) }}
            </div>

            <div v-if="tradingStore.executedInvoive?.receive_address?.address" class="row">
              <div class="col col-md-8 col-lg" style="margin-bottom: 10px">
                <InputUI
                  v-model="tradingStore.executedInvoive.receive_address.address"
                  small
                  ref="inputAddress"
                  :readonly="true"
                />
              </div>
              <div class="col-auto">
                <BaseButton type="button" color="secondary" @click="copyValue('inputAddress')">
                  {{ $t(`account.trading.depositSecondPage.copyBtn`) }}
                </BaseButton>
              </div>
            </div>
            <BaseLoader v-else />
          </div>
        </div>
      </div>
      <div class="deposit-transaction-info">
        <div class="deposit-transaction-info__icon">
          <IconInfo />
        </div>
        <div class="deposit-transaction-info__wrap">
          <div class="deposit-transaction-info__title__text">
            <div>
              {{ depositMessage }}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div class="deposit-transaction-timeblock">
        <div class="deposit-transaction-timeblock__status">
          <div class="deposit-transaction-timeblock__status-title">
            {{ $t(`account.trading.depositSecondPage.status`) }}
          </div>
          <div class="deposit-transaction-timeblock__status-text">
            <!--            {{ $t(`account.trading.depositSecondPage.statuses.waiting`) }}-->
            {{ isTimerNotExpired ? "Waiting" : "Expired" }}
          </div>
        </div>
        <div class="deposit-transaction-timeblock__timer">
          <div class="deposit-transaction-timeblock__timer-circle">
            <TransactionLoader :pending-time="expire_timer" />
          </div>
          <div class="deposit-transaction-timeblock__timer-time">
            <div class="deposit-transaction-timeblock__timer-counter">
              {{ time }}
            </div>
            <div class="deposit-transaction-timeblock__timer-text">
              {{
                isTimerNotExpired
                  ? $t(`account.trading.depositSecondPage.timeInterval`)
                  : $t(`account.trading.depositSecondPage.timeIntervalExpired`)
              }}
            </div>
          </div>
        </div>

        <BaseButton type="button" color="secondary" @click="cancelInvoice" class="ms-auto align-self-center">
          {{ $t("common.btns.cancel") }}
        </BaseButton>
      </div>

      <hr />

      <div class="deposit-transaction-footer">
        <div
          v-if="
            te(
              `account.trading.depositSecondPage.confirmationMessages.${tradingStore.executedInvoive.funding_currency}`
            )
          "
        >
          {{
            $t(
              `account.trading.depositSecondPage.confirmationMessages.${tradingStore.executedInvoive.funding_currency}`
            )
          }}
        </div>
        <div v-else>
          {{ $t(`account.trading.depositSecondPage.confirmationMessage`) }}
        </div>
      </div>
    </div>
  </CardUi>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import QrCode from "@/components/base/BaseQr/BaseQr.vue";
import IconInfo from "@/components/icons/IconInfo.vue";
import TransactionLoader from "./TransactionLoader";
import IconTransactionDownload from "@/components/icons/IconTransactionDownload";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader";
import profile from "@/services/profile";
import { trimFloatNumber } from "~~/utils/processNumbers";
import { useToast } from "@/library/vue-toast";
import { useTradingStore } from "@/stores/userTradingAccounts";
import { useWalletsStore } from "@/stores/userWallets";
import { path } from "~~/constants/routes";
import standardizeDate, { correctUtcFormat } from "~~/utils/standardizeDate";
import { useWebsockets } from "~~/composition/useWebsockets";
import { deepEqual } from "@/utils/utilsObjects";

const { t, te, rt, tm } = useI18n();
const localePath = useLocalePath();

const emits = defineEmits(["openView"]);
const tradingStore = useTradingStore();
const walletStore = useWalletsStore();
const $toast = useToast();
useWebsockets([
  {
    name: ".TraderInvoiceUpdated",
    callback: (e) => {
      updateTradingInvoice(e.model);
    },
  },
]);
const inputAmount = ref();
const inputAddress = ref();
const copyValue = (val) => {
  eval(val).value.input.select();
  document.execCommand("copy");
  $toast.success(t("common.btns.copied"), {
    position: "top-right",
  });
};

const depositMessage = computed(() => {
  const depositMessages = tm(`account.trading.depositSecondPage.depositMessages`);
  const currency = tradingStore.executedInvoive.funding_currency;
  const message = depositMessages[currency];
  if (!message) {
    return t(`account.trading.depositSecondPage.depositMessage`, {
      m$sg: currency.toUpperCase(),
    });
  } else if (typeof message === "function") {
    return rt(message);
  } else {
    const blockchain_network =
      tradingStore.executedInvoive.receive_address?.blockchain_network || tradingStore.invoice?.blockchain_network;
    // multiple blockhain_networks
    if (message[blockchain_network]) {
      return rt(message[blockchain_network]);
    }
  }
});

// date and time
const timer = ref(0);
const time = ref(null);
const expire_timer = computed(() => {
  const { date_expire, date_now } = getUtcDateNow();
  return (date_expire - date_now) / 1000;
});

const isTimerNotExpired = computed(() => expire_timer.value > 0);
const blockChairLink = computed(() => {
  const currency = SUPPORTED_COINS[tradingStore.executedInvoive?.funding_currency];
  const output = `https://blockchair.com/${currency}/transaction/${cryptoDeposit.value?.txid}`;
  return output;
});
const visualDivisibility = computed(() => {
  return walletStore.currencies.find((el) => {
    return el.code === tradingStore.executedInvoive.funding_currency
  })?.visual_divisibility || 2;
});
const floatAmoumt = computed(() => trimFloatNumber(tradingStore.executedInvoive.funding_amount, visualDivisibility.value));
const cryptoDeposit = computed(() => tradingStore.executedInvoive.crypto_deposit);
const isCoinSupported = computed(() =>
  Object.keys(SUPPORTED_COINS).includes(tradingStore.executedInvoive?.funding_currency)
);
const SUPPORTED_COINS = {
  btc: "bitcoin",
  ada: "cardano",
  eth: "ethereum",
  ltc: "litecoin",
  xrp: "ripple",
  dot: "polkadot",
  doge: "dogecoin",
  bch: "bitcoin-cash",
  sol: "solana",
  usdt: "tether",
  usdc: "usd-coin",
};
function getUtcDateNow() {
  const formattedUtcDate = correctUtcFormat();

  return {
    date_expire: new Date(standardizeDate(tradingStore.executedInvoive?.expires_at)),
    date_created: new Date(standardizeDate(tradingStore.executedInvoive?.created_at)),
    date_now: new Date(formattedUtcDate),
  };
}

function runTimer() {
  const { date_expire, date_now } = getUtcDateNow();
  const difference = (date_expire.getTime() - date_now.getTime()) / 1000;
  if (difference > 1) {
    time.value = new Date(date_expire - date_now).toISOString().slice(11, 19);
  } else {
    clearInterval(timer.value);
    time.value = "00:00:00";
  }
}

timer.value = setInterval(() => {
  runTimer();
}, 1000);
//

// execute and get
let executeTimer = ref(null);
function updateTradingInvoice(newInvoice) {
  console.log("function starts", newInvoice);
  if (newInvoice.id !== tradingStore.executedInvoive?.id) {
    console.log("another invoice updated", newInvoice.id);
    return;
  }
  if (deepEqual(newInvoice, tradingStore.executedInvoive)) {
    console.log("isEqual");
    return;
  } else {
    console.log("updated");
    tradingStore.SET_EXECUTED_INVOICE(newInvoice);
  }
}
function checkAddress() {
  if (!tradingStore.executedInvoive.receive_address?.address) {
    executeTimer.value = setTimeout(() => {
      profile.getExecutedInvoice(tradingStore.executedInvoive?.id).then((result) => {
        tradingStore.SET_EXECUTED_INVOICE(result.data);
        checkAddress();
      });
    }, 5000);
  } else {
    clearTimeout(executeTimer.value);
  }
}

async function execute() {
  let res;
  if (!tradingStore?.executedInvoive?.id) {
    navigateTo({ path: localePath(path.account.trading) });
    return;
  }
  try {
    if (!tradingStore.account.open_trader_invoice && !tradingStore.executedInvoive.id) {
      res = await profile.executeDepositInvoice({
        quote_id: tradingStore.invoice.id,
      });
    } else {
      let id = tradingStore.executedInvoive.id
        ? tradingStore.executedInvoive.id
        : tradingStore.account?.open_trader_invoice?.id;
      res = await profile.getExecutedInvoice(id);
    }
    tradingStore.SET_EXECUTED_INVOICE(res.data);
    checkAddress();
  } catch (e) {
    console.log(e);
    $toast.warning(e?.response?._data?.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
}
//

async function cancelInvoice() {
  try {
    await profile.cancelDepositInvoice(tradingStore.executedInvoive.id);
    tradingStore.SET_ACCOUNT({});
    tradingStore.SET_INVOICE({});
    tradingStore.SET_EXECUTED_INVOICE({});
  } catch (e) {
    $toast.warning(e?.response?._data?.message, { position: "top-right" });
  } finally {
    navigateTo({ path: localePath(path.account.trading), replace: true });
  }
}

function init() {
  execute();
}

const isLoading = ref(true);
onMounted(() => {
  init();
});

onUnmounted(() => {
  clearInterval(timer.value);
  clearInterval(executeTimer.value);
});
</script>

<style scoped lang="scss">
.deposit-transaction {
  &-header {
    display: flex;
    justify-content: space-between;
    padding: 15px 40px;
    margin-bottom: 60px;
    background: $color-orange-lightest;
    border-radius: 4px;
    @include media-breakpoint-down("md") {
      padding: 15px 20px;
    }
    &__left {
      display: flex;
      font-size: 18px;
      font-weight: 500;
      line-height: 145%;
      @include media-breakpoint-down("md") {
        font-size: 16px;
      }
    }
    &__icon {
      margin-right: 20px;
    }
    &__amount {
      margin-bottom: 0;
      @include media-breakpoint-down("md") {
        font-size: 16px;
      }
    }
    &__course {
      margin-bottom: 0;
      font-size: 15px;
      font-weight: 400;
      line-height: 145%;
      @include media-breakpoint-down("md") {
        font-size: 16px;
      }
    }
  }
  &-content {
    &__text {
      font-size: 15px;
      font-weight: 400;
      line-height: 145%;
      color: $color-grey;
      @include media-breakpoint-down("md") {
        margin-top: 20px;
        font-size: 12px;
      }
    }
    &__input-title {
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
      line-height: 145%;
      color: $color-text-dark;
    }
  }
  &-info {
    display: flex;
    margin-top: 60px;
    margin-bottom: 30px;
    font-size: 14px;
    font-weight: 400;
    line-height: 145%;
    @include media-breakpoint-down("md") {
      font-size: 12px;
    }
    &__icon {
      margin-right: 15px;
    }
    &__title {
      font-weight: 700;
    }
  }
  &-timeblock {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    @include media-breakpoint-down("md") {
      align-items: center;
    }
    &__status {
      margin-right: 50px;
      @include media-breakpoint-down("md") {
        margin-right: 10px;
      }
      &-title {
        font-size: 15px;
        font-weight: 400;
        line-height: 145%;
        color: $color-grey;
        @include media-breakpoint-down("md") {
          font-size: 16px;
          text-align: right;
        }
      }
      &-text {
        font-size: 24px;
        font-weight: 400;
        line-height: 140%;
        @include media-breakpoint-down("md") {
          font-size: 16px;
        }
      }
    }
    &__timer {
      display: flex;
      &-time {
        margin-left: 50px;
        @include media-breakpoint-down("md") {
          margin-left: 10px;
        }
      }
      &-circle {
        display: flex;
        align-items: center;
      }
      &-counter {
        font-size: 24px;
        font-weight: 700;
        line-height: 140%;
        @include media-breakpoint-down("md") {
          font-size: 16px;
        }
      }
      &-text {
        font-size: 15px;
        font-weight: 400;
        line-height: 145%;
        color: $color-grey;
        @include media-breakpoint-down("md") {
          font-size: 14px;
        }
      }
    }
  }
  &-footer {
    margin-top: 20px;
    font-size: 15px;
    font-weight: 400;
    line-height: 145%;
    color: $color-grey;
  }
}
</style>
