<template>
  <div>
    <AccountWrapSubPage
      v-if="!isSuccess"
      :label="$t(`account.trading.subPages.withdrawal`)"
      with-go-back
      @go-back="navigateBack"
    >
      <AppLoader v-if="isLoading" />

      <CardUi v-else in-content>
        <div class="row">
          <div class="col-xl-6">
            <BaseLabel forValue="currency" small>{{ $t(`account.loans.helpers.currency`) }}</BaseLabel>
            <BaseSelect
              :selectList="cryptoCurrencies"
              :selectedItem="selectedCurrency"
              @update:selected-item="chooseCurrency"
              data-value="name"
              data-label="name"
              :border="true"
              class="mb-4"
              isIcons
            />

            <BaseLabel v-if="blockchain_networks.length > 0" small>{{
              $t(`account.wallets.walletsTab.withdrawal.network`)
            }}</BaseLabel>
            <BaseSelect
              v-if="blockchain_networks.length > 0"
              :selectList="blockchain_networks"
              :selectedItem="selectedBlockchainNetwork"
              @update:selected-item="chooseBlockchainNetwork"
              data-value="name"
              data-label="name"
              :border="true"
              class="mb-4"
              :disabled="blockchain_networks.length == 1"
              :placeholder-text="$t(`account.wallets.walletsTab.withdrawal.networkPlaceholder`)"
            />

            <BaseLabel forValue="Amount" small>
              {{ $t(`account.wallets.walletsTab.withdrawal.amount`) }}
              <div class="fw-normal">
                {{ $t(`account.wallets.walletsTab.withdrawal.balance`) }}:
                <span class="balance-value">
                  {{ convertedAmount }}
                  {{ selectedCurrency.code.toUpperCase() }}</span
                >
              </div>
            </BaseLabel>
            <Input
              label="Amount"
              inputmode="decimal"
              :placeholder="$t(`account.wallets.walletsTab.withdrawal.amount`)"
              v-model="transfer.amount"
              class="mb-4"
              :max="convertedAmount"
              small
              :error="amountError"
              type="number"
              @update:model-value="transfer.amount = trimFloatNumber($event, visual_divisibility)"
            />

            <div class="w-100"></div>

            <BaseLabel forValue="Address" small>{{ $t(`account.wallets.walletsTab.withdrawal.address`) }}</BaseLabel>
            <Input
              label="Address"
              :placeholder="$t(`account.wallets.walletsTab.withdrawal.address`)"
              v-model="transfer.address"
              :error="addressError"
              class="mb-4"
              small
            />
            <div class="w-100"></div>
            <BaseLabel forValue="Network Fee" small>{{
              $t(`account.wallets.walletsTab.withdrawal.networkFee`)
            }}</BaseLabel>
            <Input
              label="Network Fee"
              :placeholder="$t(`account.wallets.walletsTab.withdrawal.networkFee`)"
              v-model="withdrawalCommission"
              class="mb-4"
              small
              disabled
            />

            <div class="w-100"></div>

            <WarningNotification v-if="!userStore.user.first_deposited_at">
              {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalErrors.verifiedDepositNotification`) }}
              <NuxtLink :to="{
                path: localePath(`/profile/trading/deposit`),
                query: {
                  id: tradingStore.account.external_id,
                },
              }">
                {{ $t(`account.wallets.walletsTab.withdrawal.makeDeposit`) }}
              </NuxtLink>
            </WarningNotification>

            <WarningNotification v-else-if="!userStore.verifiedUser">
              {{ $t(`account.wallets.walletsTab.withdrawal.withdrawalErrors.verifiedNotification`) }}
              <NuxtLink :to="localePath({ name: 'profile', query: { action: 'verification' } })">{{
                $t(`account.wallets.walletsTab.withdrawal.startVerification`)
              }}</NuxtLink>
            </WarningNotification>
          </div>
        </div>
        <hr />

        <BaseButton type="button" @click="send" :disabled="!userStore.verifiedUser">
          {{ $t(`account.trading.transfer.continueBtn`) }}
        </BaseButton>

        <BaseButton type="button" color="secondary" class="ms-4" @click="getBack">
          {{ $t(`account.trading.transfer.backToTrading`) }}
        </BaseButton>
      </CardUi>
    </AccountWrapSubPage>
    <AccountWrapSubPage
      v-else
      :label="$t(`account.trading.subPages.openedWithdrawal`)"
      with-go-back
      @go-back="navigateBack"
    >
      <TransferSuccess :data="withdrawalResult" @return="getBack" />
    </AccountWrapSubPage>
  </div>
</template>

<script setup>
import { path } from "@/constants/routes";
import { computed, reactive, ref } from "vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import BaseSelect from "@/components/base/BaseSelect/BaseSelect.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import Input from "@/components/base/BaseInput/BaseInput.vue";
import BaseLabel from "@/components/base/BaseLabel/BaseLabel.vue";
import { trimFloatNumber } from "~~/utils/processNumbers";
import WarningNotification from "@/components/account/WarningNotification.vue";
import profile from "@/services/profile";
import { useUserStore } from "~~/stores/userStore";
import { useToast } from "@/library/vue-toast";
import { useTradingStore } from "~~/stores/userTradingAccounts";
import { useWalletsStore } from "~~/stores/userWallets";
import services from "@/services/landings";
import Big from "big.js";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import TransferSuccess from "./TransferSuccess.vue";

const route = useRoute();
const userStore = useUserStore();

const $toast = useToast();
const localePath = useLocalePath();
const { t } = useI18n();
const tradingStore = useTradingStore();
const walletStore = useWalletsStore();
const isLoading = ref(true);
const transfer = reactive({
  type: "external",
  amount: null,
  address: "",
});
const exchangeInfo = ref(null);
const selectedCurrency = ref(null);
const selectedBlockchainNetwork = ref(null);
const blockchain_networks = computed(
  () => selectedCurrency.value?.blockchain_networks?.map((network) => ({ name: network })) || []
);
const visual_divisibility = computed(() => {
  return walletStore.currencies.find((el) => el.code === selectedCurrency.value?.code)?.visual_divisibility || 2;
});
const convertedAmount = computed(() => {
  if (!exchangeInfo.value) {
    return "-";
  }
  const result = new Big(account.value.withdrawable_balance).times(exchangeInfo.value.conversion_rate).toString();
  const output = trimFloatNumber(result, visual_divisibility.value);
  return output;
});
const withdrawalSetting = computed(() =>
  walletStore.settings.find(
    (el) =>
      el.currency === selectedCurrency.value.code && el.blockchain_network == selectedBlockchainNetwork.value?.name
  )
);

const withdrawalCommission = computed(() => {
  return withdrawalSetting.value.withdrawal_commission;
});

const rules = {
  amount: {
    required: {
      ...required,
      $message: t("account.wallets.walletsTab.withdrawal.withdrawalErrors.required"),
    },
  },
  address: {
    required: {
      ...required,
      $message: t("account.wallets.walletsTab.withdrawal.withdrawalErrors.required"),
    },
  },
};
const navigateBack = () => {
  navigateTo({ path: localePath(path.account.trading) });
};
const v$ = useVuelidate(rules, transfer);
const onValidate = async () => await v$.value.$validate();

const amountError = computed(() => {
  if (v$.value.amount.$errors.length) return v$.value.amount.$errors[0].$message;
  else if (transfer.amount && +transfer.amount < +withdrawalSetting.value?.min_withdrawal_amount)
    return t("account.wallets.walletsTab.withdrawal.withdrawalErrors.minValue", {
      m$sg: withdrawalSetting.value?.min_withdrawal_amount,
    });
  return false;
});

const addressError = computed(() => {
  if (v$.value.address.$errors.length) return v$.value.address.$errors[0].$message;
  return false;
});

const account = computed(() => tradingStore.account);

const cryptoCurrencies = computed(() => walletStore.currencies.filter((el) => el.is_crypto));

async function chooseCurrency(val) {
  selectedCurrency.value = val;
  transfer.amount = 0;
  transfer.address = "";
  if (val.blockchain_networks?.length) {
    chooseBlockchainNetwork({ name: val.blockchain_networks[0] });
  } else {
    chooseBlockchainNetwork(null);
  }
  await updateExchangeInfo();
}

function chooseBlockchainNetwork(network) {
  selectedBlockchainNetwork.value = network;
}

async function send() {
  const isValid = await onValidate();
  if (isValid && userStore.verifiedUser && !amountError.value) {
    let invertedAmount = new Big(transfer.amount).div(exchangeInfo.value.conversion_rate).toString();
    const divisibility = walletStore.currencies.find((cur) => cur.code === account.value.currency)?.divisibility;
    invertedAmount = trimFloatNumber(invertedAmount, divisibility || 8);
    const dataRequest = {
      ...transfer,
      amount: invertedAmount,
      currency: selectedCurrency.value?.code,
    };

    if (selectedBlockchainNetwork.value?.name) {
      dataRequest.blockchain_network = selectedBlockchainNetwork.value.name;
    }
    try {
      const res = await profile.createTradingTransfer(route.params.id, dataRequest);
      withdrawalResult.value = res.data;
      isSuccess.value = true;
    } catch (error) {
      $toast.warning(error.response?._data?.message, { position: "top-right" });
    }
  }
}

const isSuccess = ref(false);
const withdrawalResult = ref(null);

function getBack() {
  navigateTo({ path: localePath("/profile/trading/") });
}

onMounted(async () => {
  try {
    const { data: user } = await profile.getUserProfile();
    await userStore.SET_USER(user);

    if (!tradingStore.account.id) {
      const { data } = await profile.fetchTradingAccount(route.params.id);
      tradingStore.SET_ACCOUNT(data);
    }
    if (!walletStore.settings.length) {
      walletStore.FETCH_SETTINGS();
    }
    if (!walletStore.currencies.length) {
      await walletStore.FETCH_CURRENCIES();
    }

    if (tradingStore.account.open_withdrawal_order) {
      withdrawalResult.value = tradingStore.account.open_withdrawal_order;
      isSuccess.value = true;
    } else {
      const accountCurrency = walletStore.currencies.find((cur) => cur.code === tradingStore.account.currency);
      if (accountCurrency?.is_crypto) {
        selectedCurrency.value = accountCurrency;
        selectedBlockchainNetwork.value = accountCurrency.blockchain_networks?.[0]
          ? { name: accountCurrency.blockchain_networks[0] }
          : null;
      } else {
        const defaultCurrency = cryptoCurrencies.value?.find((cur) => cur.code === "usdt");
        selectedCurrency.value = defaultCurrency;
        selectedBlockchainNetwork.value = { name: "trc20" };
      }
      await updateExchangeInfo();
    }
  } catch (error) {
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
});

async function updateExchangeInfo() {
  if (selectedCurrency.value?.code !== account.value.currency) {
    const exchangeRes = await services.getCalculatorExchangeData({
      currency_from: account.value.currency,
      currency_to: selectedCurrency.value?.code,
    });
    exchangeInfo.value = exchangeRes.data;
  } else {
    exchangeInfo.value = { conversion_rate: 1 };
  }
}
</script>

<style lang="scss" scoped>
.balance-value {
  color: $color-primary;
}
</style>
