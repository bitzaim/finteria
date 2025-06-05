<template>
  <div class="deposit-transaction-timeblock">
    <div class="deposit-transaction-timeblock__status">
      <div class="deposit-transaction-timeblock__status-title">
        {{ $t(`account.trading.depositSecondPage.status`) }}
      </div>
      <div class="deposit-transaction-timeblock__status-text">
        {{
          cryptoDeposit?.status === "in_progress"
            ? $t(`account.trading.depositSecondPage.statuses.pending`)
            : isCryptoDepositCompleted
            ? $t(`account.trading.depositSecondPage.statuses.completed`)
            : $t(`account.trading.depositSecondPage.statuses.waiting`)
        }}
      </div>
    </div>
    <div class="deposit-transaction-timeblock__timer">
      <div class="deposit-transaction-timeblock__timer-circle">
        <TransactionLoader :pending-time="expire_timer > 0 ? expire_timer : 1" :completed="isCryptoDepositCompleted" />
      </div>
      <div v-if="!isCryptoDepositCompleted" class="deposit-transaction-timeblock__timer-time">
        <div class="deposit-transaction-timeblock__timer-counter">
          {{ time }}
        </div>
        <div class="deposit-transaction-timeblock__timer-text">
          {{ $t(`account.trading.depositSecondPage.timeInterval`) }}
        </div>
      </div>
    </div>

    <span class="ms-2"></span>

    <BaseButton
      type="button"
      color="secondary"
      @click="onClickCancel"
      class="ms-auto align-self-center"
      :disabled="isCancelDisabled"
    >
      {{ $t("common.btns.cancel") }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import TransactionLoader from "@/components/account/trading/TransactionLoader.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import { useTradingStore } from "@/stores/userTradingAccounts";
import standardizeDate, { correctUtcFormat } from "@/utils/standardizeDate";

const emit = defineEmits(["cancel"]);
const tradingStore = useTradingStore();

const timer = ref<NodeJS.Timer>();
const time = ref<string | null>(null);

const cryptoDeposit = computed(() => tradingStore.executedInvoive.crypto_deposit);

const expire_timer = computed<number>(() => {
  const { date_expire, date_now } = getUtcDateNow();

  return date_expire && date_now ? (date_expire.valueOf() - date_now.valueOf()) / 1000 : 0;
});

timer.value = setInterval(() => {
  runTimer();
}, 1000);

const isCryptoDepositCompleted = computed(() => {
  return cryptoDeposit.value?.status === "completed";
});

const isCancelDisabled = computed(() => {
  return cryptoDeposit.value?.status === "in_progress" || isCryptoDepositCompleted.value;
});

const getUtcDateNow = (): {
  date_expire: Date | undefined;
  date_created: Date | undefined;
  date_now: Date;
} => {
  const formattedUtcDate = correctUtcFormat();

  return {
    date_expire: tradingStore.executedInvoive?.expires_at
      ? new Date(standardizeDate(tradingStore.executedInvoive?.expires_at))
      : undefined,
    date_created: tradingStore.executedInvoive?.created_at
      ? new Date(standardizeDate(tradingStore.executedInvoive?.created_at))
      : undefined,
    date_now: new Date(formattedUtcDate),
  };
};

const runTimer = () => {
  const { date_expire, date_now } = getUtcDateNow();

  if (date_expire && date_now) {
    const difference = (date_expire.getTime() - date_now.getTime()) / 1000;

    if (difference > 1) {
      time.value = new Date(date_expire.valueOf() - date_now.valueOf()).toISOString().slice(11, 19);
    } else {
      clearInterval(timer.value);
      time.value = "00:00:00";
    }
  }
};

const onClickCancel = () => {
  emit("cancel");
};
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
