<template>
  <div class="exchange-success">
    <h4 class="exchange-success__title d-flex align-items-center mt-4">
      <IconSandClock class="me-2" /> {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalSuccess.inReview`) }}
    </h4>

    <div class="exchange-success__wrap">
      <div class="exchange-success__wrap-left">
        <div class="exchange-success__wrap-item">
          {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalSuccess.address`) }}
        </div>
        <div class="exchange-success__wrap-item">
          {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalSuccess.amount`) }}
        </div>
        <div class="exchange-success__wrap-item">
          {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalSuccess.status`) }}
        </div>
      </div>

      <div class="exchange-success__wrap-right">
        <div class="exchange-success__wrap-item">
          <span class="fw-bold">{{ props.infoData.address }}</span>
        </div>
        <div class="exchange-success__wrap-item">
          <span class="fw-bold">{{ `${props.infoData.amount} ${props.infoData.currency.toUpperCase()}` }}</span>
        </div>
        <div class="exchange-success__wrap-item">
          <span class="fw-bold">
            {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalSuccess.statusResult`) }}
          </span>
        </div>
      </div>
    </div>

    <div class="mb-3 exchange-success__small-text">
      {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalSuccess.info`) }}
    </div>

    <BaseButton type="button" color="secondary" class="me-2" @click="goBack">
      {{ $t("account.wallets.walletsTab.withdrawal.withdrawalSuccess.backToWallets") }}
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import IconSandClock from "@/components/icons/IconSandClock.vue";
import { computed } from "vue";
import { trimFloatNumber } from "~~/utils/processNumbers";

const props = defineProps(["infoData"]);
const emits = defineEmits("return");

const from_currency = computed(() => props.infoData.from_currency.display_code?.toUpperCase());
const to_currency = computed(() => props.infoData.to_currency.display_code?.toUpperCase());
const from_amount = computed(() => trimFloatNumber(props.infoData.from_amount));
const to_amount = computed(() => trimFloatNumber(props.infoData.to_amount));

function goBack() {
  emits("return");
}
</script>

<style scoped lang="scss">
.exchange-success {
  padding: 0 30px 30px;
}

.exchange-success__title {
  margin-bottom: 15px;
}

.exchange-success__wrap {
  display: grid;
  grid-template-columns: 0fr 1fr;
  gap: 30px;
  padding: 22px 30px;
  margin-bottom: 15px;
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
  grid-template-rows: 3fr;
  grid-template-columns: 1fr;
  gap: 15px;
}

.exchange-success__small-text {
  font-size: 14px;
  color: $color-grey;
}
</style>
