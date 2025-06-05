<template>
  <div class="exchange-success">
    <h4 class="exchange-success__title d-flex align-items-center">
      <IconCheck class="me-2" /> {{ $t("common.btns.done") }}
    </h4>

    <div class="exchange-success__wrap">
      <div class="exchange-success__wrap-left">
        <div class="exchange-success__wrap-item">{{ $t("account.trading.depositSuccessPage.paid") }}</div>
        <div class="exchange-success__wrap-item">{{ $t("account.trading.depositSuccessPage.deposited") }}</div>
        <div class="exchange-success__wrap-item">{{ $t("account.trading.depositFirstPage.bonus") }}</div>
      </div>

      <div class="exchange-success__wrap-right">
        <div class="exchange-success__wrap-item">
          {{ tradingStore.executedInvoive.funding_amount }}
          <span>
            {{ tradingStore.executedInvoive.funding_currency.toUpperCase() }}
          </span>
        </div>
        <div class="exchange-success__wrap-item">
          {{ tradingStore.executedInvoive.deposit_amount }}
          <span>
            {{ tradingStore.executedInvoive.deposit_currency.toUpperCase() }}
          </span>
        </div>
        <!--        <div class="exchange-success__wrap-item">-->
        <!--          {{ tradingStore.executedInvoive.display_amount }}-->
        <!--          <span>-->
        <!--            {{ tradingStore.executedInvoive.display_currency.display_code.toUpperCase() }}-->
        <!--          </span>-->
        <!--        </div>-->
        <div class="exchange-success__wrap-item">
          {{ tradingStore.executedInvoive.bonus_amount }}
          <span>
            {{ tradingStore.executedInvoive.display_currency.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

    <BaseButton type="button" color="tertiary" class="me-2" @click="goBack">{{ $t("common.btns.goBack") }}</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import IconCheck from "@/components/icons/IconCheck.vue";
import { useTradingStore } from "@/stores/userTradingAccounts";
const tradingStore = useTradingStore();
const props = defineProps(["infoData"]);
const emits = defineEmits("reset");

function goBack() {
  emits("reset");
}
</script>

<style scoped lang="scss">
.exchange-success {
  padding: 0 30px 30px;
  @include media-breakpoint-up("xl") {
    width: 50%;
  }
  @include media-breakpoint-down("sm") {
    padding-top: 30px;
  }
}

.exchange-success__title {
  margin-bottom: 15px;
}

.exchange-success__wrap {
  display: grid;
  grid-template-columns: 0fr 1fr;
  gap: 30px;
  padding: 22px 30px;
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  color: $color-text-dark;
  border: 1px solid $color-disable-light;
  border-radius: 4px;
}

.exchange-success__wrap-left,
.exchange-success__wrap-right {
  display: grid;
  grid-template-rows: 4fr;
  grid-template-columns: 1fr;
  gap: 15px;
}
</style>
