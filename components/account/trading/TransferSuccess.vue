<template>
  <div class="transfer-success">
    <h4 class="transfer-success__title d-flex align-items-center">
      <IconSandClock class="me-2" /> {{ $t(`account.trading.transfer.inReview`) }}
    </h4>

    <div class="transfer-success__wrap">
      <div class="transfer-success__wrap-left">
        <div class="transfer-success__wrap-item">{{ $t(`account.trading.withdrawal.amount`) }}:</div>
        <div class="transfer-success__wrap-item">{{ $t(`account.trading.transfer.status`) }}:</div>
        <template v-if="props.data.external_withdrawal">
          <div class="transfer-success__wrap-item">{{ $t(`account.trading.withdrawal.address`) }}:</div>
          <div class="transfer-success__wrap-item" v-if="props.data.external_withdrawal.blockchain_network">
            {{ $t(`account.trading.withdrawal.blockchain_network`) }}:
          </div>
          <div class="transfer-success__wrap-item">{{ $t(`account.wallets.walletsTab.withdrawal.networkFee`) }}:</div>
          <div class="transfer-success__wrap-item">{{ $t(`account.trading.withdrawal.youGet`) }}:</div>
        </template>
      </div>

      <div class="transfer-success__wrap-right">
        <div class="transfer-success__wrap-item fw-bold">{{ amount }} {{ props.data.currency.toUpperCase() }}</div>
        <div class="transfer-success__wrap-item fw-bold" style="text-transform: capitalize">
          {{ props.data.status }}
        </div>
        <template v-if="props.data.external_withdrawal">
          <div class="transfer-success__wrap-item fw-bold" style="overflow-x: hidden">
            {{ props.data.external_withdrawal.address }}
          </div>
          <div
            class="transfer-success__wrap-item fw-bold"
            v-if="props.data.external_withdrawal.blockchain_network"
            style="text-transform: uppercase"
          >
            {{ props.data.external_withdrawal.blockchain_network }}
          </div>
          <div class="transfer-success__wrap-item fw-bold">
            {{ props.data.external_withdrawal.withdrawal_commission }}
          </div>
          <div class="transfer-success__wrap-item fw-bold">
            {{
              trimFloatNumber(
                props.data.external_withdrawal.estimated_withdrawal_amount,
                walletsStore.getCurrencyVisualDivisibility(props.data.external_withdrawal.currency)
              )
            }}
          </div>
        </template>
      </div>
    </div>
    <div class="mb-3 transfer-success__small-text">
      {{ $t(`account.trading.transfer.info`) }}
    </div>

    <BaseButton v-if="isCancellable" type="button" color="secondary" class="me-2 mb-2" @click="cancel">
      {{ $t(`common.btns.cancel`) }}
    </BaseButton>
    <BaseButton type="button" color="tertiary" class="me-2 mb-2" @click="goToTrading">
      {{ $t(`account.trading.transfer.backToTrading`) }}
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import IconSandClock from "@/components/icons/IconSandClock.vue";
import { computed } from "vue";
import { path } from "@/constants/routes";
import { trimFloatNumber } from "~~/utils/processNumbers";
import { useWalletsStore } from "@/stores/userWallets";
import { useToast } from "@/library/vue-toast";
import profile from "@/services/profile";

const localePath = useLocalePath();
const walletsStore = useWalletsStore();
const $toast = useToast();
const props = defineProps(["data"]);
const emits = defineEmits("reset");

const amount = computed(() =>
  trimFloatNumber(props.data.amount, walletsStore.getCurrencyVisualDivisibility(props.data.currency))
);

const isCancellable = computed(() => props.data.type === "external"); // if it's external transfer we could cancel it

async function cancel() {
  try {
    await profile.cancelTradingTransfer(props.data.id);
  } catch (error) {
    $toast.warning(e.response._data.message, { position: "top-right" });
  } finally {
    goToTrading();
  }
}

function goToTrading() {
  navigateTo(localePath(path.account.trading));
}
</script>

<style scoped lang="scss">
.transfer-success {
  padding: 0 30px 30px;
  @include media-breakpoint-down("sm") {
    padding-top: 30px;
  }
}

.transfer-success__title {
  margin-bottom: 15px;
}

.transfer-success__wrap {
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
  @include media-breakpoint-down("md") {
    width: 100%;
  }
}

.transfer-success__wrap-left,
.transfer-success__wrap-right {
  display: grid;
  grid-template-rows: 3fr;
  grid-template-columns: 1fr;
  gap: 15px;
}

.transfer-success__wrap-item {
  overflow-wrap: break-word;
}

.transfer-success__wrap-left > .transfer-success__wrap-item {
  width: max-content;
  @include media-breakpoint-down("md") {
    width: auto;
  }
}

.transfer-success__small-text {
  font-size: 14px;
  color: $color-grey;
}
</style>
