<template>
  <div>
    <div v-if="isLoading"></div>
    <template v-else-if="cryptoDeposit">
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
    </template>
    <template v-else>
      <h2 class="modal__title">
        {{ $t(`account.trading.depositWithModal.title`) }}
      </h2>
      <p class="modal__text">
        {{
          $t(`account.trading.depositWithModal.paragraph`, {
            m$sg: `"Deposit Crypto"`,
          })
        }}
        <br />
      </p>

      <div v-if="tradingStore.executedInvoive?.receive_address?.address" class="row row-address">
        <div class="col col-md-8 col-lg">
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
      <BaseLoader v-else inline class="baseLoader" />
      <div class="IframeWrapper">
        <iframe width="100%" height="390" frameborder="none" :src="`https://widget.changelly.com?${widgetLink}`">{{
          $t("account.trading.depositWithModal.cantLoadWidget")
        }}</iframe>
      </div>

      <div class="deposit-transaction-timeblock" style="margin-top: 0">
        <div class="deposit-transaction-timeblock__status">
          <div class="deposit-transaction-timeblock__status-title">
            {{ $t(`account.trading.depositSecondPage.status`) }}
          </div>
          <div class="deposit-transaction-timeblock__status-text">
            {{
              isTimerNotExpired
                ? $t(`account.trading.depositSecondPage.statuses.waiting`)
                : $t(`account.trading.depositSecondPage.statuses.expired`)
            }}
          </div>
        </div>
        <div class="deposit-transaction-timeblock__timer">
          <div class="deposit-transaction-timeblock__timer-circle">
            <!--              :percents="timerPercents" -->
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

        <span class="ms-2"></span>

        <BaseButton type="button" color="secondary" @click="cancelInvoice" class="ms-auto align-self-center">
          {{ $t("common.btns.cancel") }}
        </BaseButton>
      </div>

      <div class="mt-5">
        <div>
          {{ $t("account.trading.depositSecondPage.needAssistance") }}
          <button class="modal__link" @click="requestCallback">
            {{ $t("account.trading.depositSecondPage.requestCallback") }}
          </button>
          {{ $t("account.trading.depositSecondPage.or") }}
          <button class="modal__link" @click="openChat">
            {{ $t("account.trading.depositSecondPage.chatWithUs") }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from "vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import TransactionLoader from "./TransactionLoader";
import IconTransactionDownload from "@/components/icons/IconTransactionDownload";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import profile from "@/services/profile";
import { useToast } from "@/library/vue-toast";
import { useTradingStore } from "@/stores/userTradingAccounts";
import standardizeDate, { correctUtcFormat } from "~~/utils/standardizeDate";
import { useWebsockets } from "~~/composition/useWebsockets";
import { deepEqual } from "@/utils/utilsObjects";
import { trimFloatNumber } from "~~/utils/processNumbers";
import { useUserStore } from "~~/stores/userStore";

const { t, te } = useI18n();
const emits = defineEmits(["cancel"]);
const tradingStore = useTradingStore();
const $toast = useToast();
const userStore = useUserStore();
const floatAmoumt = computed(() => trimFloatNumber(tradingStore.executedInvoive.funding_amount));
const cryptoDeposit = computed(() => tradingStore.executedInvoive.crypto_deposit);
// const cryptoDeposit = computed(() => {return {txid: "123123", status: "in_progress", amount: 100}});
const widgetLink = computed(() => {
  let output = "";
  const to = tradingStore.executedInvoive.deposit_currency === "eth" ? "eth" : "btc";
  const queryGen = {
    from: "*",
    to,
    amount: tradingStore.executedInvoive.display_amount,
    address: tradingStore.executedInvoive.receive_address?.address,
    fromDefault: tradingStore.executedInvoive.display_currency,
    toDefault: to,
    merchant_id: "7StfEJtreLjNmf3B",
    payment_id: "",
    v: "3",
    type: "no-rev-share",
    color: "306bcf",
    headerId: "2",
    logo: "hide",
    buyButtonTextId: "4",
  };

  for (const key in queryGen) {
    output += `${key}=${queryGen[key]}&`;
  }
  return output;
});

const inputAddress = ref();
const copyValue = (val) => {
  eval(val).value.input.select();
  document.execCommand("copy");
  $toast.success(t("common.btns.copied"), {
    position: "top-right",
  });
};

// date and time
const timer = ref(0);
const time = ref(null);
const expire_timer = computed(() => {
  const { date_expire, date_now } = getUtcDateNow();
  return (date_expire - date_now) / 1000;
});

const isTimerNotExpired = computed(() => expire_timer.value > 0);

useWebsockets([
  {
    name: ".TraderInvoiceUpdated",
    callback: (e) => {
      updateTradingInvoice(e.model);
    },
  },
]);

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
  if (isTimerNotExpired.value) {
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

//

async function cancelInvoice() {
  const invoiceId = tradingStore.executedInvoive.id;
  try {
    await profile.cancelDepositInvoice(invoiceId);
    tradingStore.SET_ACCOUNT({});
    tradingStore.SET_INVOICE({});
    tradingStore.SET_EXECUTED_INVOICE({});
  } catch (e) {
    $toast.error(e?.response?._data?.message, { position: "top-right" });
  } finally {
    emits("cancel", invoiceId);
  }
}

function init() {
  try {
    checkAddress();
  } catch (e) {
    console.log(e);
    $toast.error(e?.response?._data?.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
}

const isLoading = ref(true);
onMounted(() => {
  init();
});

onUnmounted(() => {
  clearInterval(timer.value);
  clearInterval(executeTimer.value);
});

function openChat() {
  jivo_api?.open();
}

function requestCallback() {
  const phone = userStore.user.phone_number;
  const apiResult = jivo_api?.startCall(phone);

  if (apiResult?.result === "ok") {
    console.log("Call started, phone: ", phone);
  } else {
    console.log("Failed to start the call, reason: ", apiResult.reason);
  }
}
</script>

<style scoped lang="scss">
.baseLoader {
  height: 44px;
}
.IframeWrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 420px;
  margin: 0 auto;
  overflow: hidden;
}

.IframeWrapper > :first-child {
  margin-bottom: 35px;
}
.modal {
  .row {
    align-items: center;
    &-address {
      margin-bottom: 5px;
    }
  }
  &__title {
    margin-bottom: 10px;

    @include media-breakpoint-down("md") {
      margin-bottom: 5px;
      font-size: 20px;
    }
    @include media-breakpoint-down("sm") {
      margin-bottom: 10px;
      font-size: 16px;
    }
  }

  &__link {
    color: $color-link;
    cursor: pointer;
    &:hover {
      color: $color-link-hover;
    }
  }

  &__text {
    margin-bottom: 15px;
    white-space: pre-wrap;

    @include media-breakpoint-down("md") {
      margin-bottom: 5px;
      font-size: 14px;
    }
  }
}
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
