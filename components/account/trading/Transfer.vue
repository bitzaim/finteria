<template>
  <BaseLoader v-if="isLoading" />
  <CardUi in-content v-else>
    <div class="row">
      <div class="col-xl-6">
        <LabelUI forValue="Amount" small class="transfer-input__label">
          {{ $t(`account.trading.transfer.amount`) }}
          <div>
            {{ $t(`account.trading.transfer.available`) }}:
            <span class="color-blue">
              {{ trimFloatNumber(available, currentCurrency?.visual_divisibility || 8) }}
              {{ tradingStore.account.currency?.toUpperCase() }}</span
            >
          </div>
        </LabelUI>
        <InputUI
          inputmode="decimal"
          label="Amount"
          type="number"
          :placeholder="$t(`account.trading.transfer.amount`)"
          :modelValue="transfer.amount"
          @update:modelValue="(val) => (transfer.amount = trimFloatNumber(val, currentCurrency.divisibility))"
          class="mb-3 transfer-input__text"
          :max="String(available)"
          small
        />

        <WarningNotification v-if="tradingStore.account.bonus > 0 && tradingStore.account.platform_type !== 'options'">
          Withdrawal will cancel all active bonuses and may result in liquidation of open positions.
        </WarningNotification>
      </div>
    </div>

    <hr />
    <BaseButton type="button" @click="executeTransfer">{{ $t(`account.trading.transfer.continueBtn`) }}</BaseButton>
  </CardUi>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import LabelUI from "@/components/base/BaseLabel/BaseLabel.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import WarningNotification from "@/components/account/WarningNotification.vue";
import { reactive, ref } from "vue";
import profile from "@/services/profile";
import { useToast } from "@/library/vue-toast";
import { useTradingStore } from "@/stores/userTradingAccounts";
import { path } from "@/constants/routes";
import { useWalletsStore } from "@/stores/userWallets";
import { trimFloatNumber } from "@/utils/processNumbers";

const { t } = useI18n();
const localePath = useLocalePath();
const tradingStore = useTradingStore();
const walletStore = useWalletsStore();

const available = computed(() => {
  let result = tradingStore.account.withdrawable_balance;
  return result;
});

const currentCurrency = walletStore.currencies?.find((currency) => currency.code === tradingStore.account?.currency);

const $toast = useToast();
const emits = defineEmits(["continue"]);
const isLoading = ref(false);
const transfer = reactive({
  amount: "",
  account: null,
});

async function executeTransfer() {
  try {
    isLoading.value = true;
    const { data } = await profile.createTradingTransfer(tradingStore.account.id, { amount: transfer.amount });
    $toast.success(t("common.toast.success"), { position: "top-right" });
    emits("continue", data);
  } catch (e) {
    $toast.warning(e.response._data.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
}

async function fetch() {
  try {
    isLoading.value = true;
    const { data } = await profile.fetchTradingAccount(tradingStore.account.id);
    tradingStore.SET_ACCOUNT(data);
  } catch (e) {
    console.dir(e);
    $toast.warning(e.response._data.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (isNaN(Number(tradingStore.account.balance))) {
    navigateTo({
      path: localePath(path.account.trading),
    });
  } else {
    fetch();
  }
});
</script>

<style lang="scss" scoped>
.transfer {
  &-input__label {
    & > div {
      margin-left: auto;
      font-weight: normal;
    }
  }
}
.color-blue {
  color: $color-primary;
}
</style>
