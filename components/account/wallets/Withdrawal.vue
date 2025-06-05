<template>
  <CardUi in-content v-if="!isSuccess">
    <div class="row">
      <div class="col-xl-6">
        <BaseLabel forValue="Amount" small>
          {{ $t(`account.wallets.walletsTab.withdrawal.amount`) }}
          <div class="fw-normal">
            {{ $t(`account.wallets.walletsTab.withdrawal.balance`) }}:
            <span class="balance-value">
              {{ transferData.balance }}
              {{ transferData.currency?.toUpperCase() }}</span
            >
          </div>
        </BaseLabel>
        <Input
          label="Amount"
          inputmode="decimal"
          :placeholder="$t(`account.wallets.walletsTab.withdrawal.amount`)"
          v-model="transfer.amount"
          class="mb-4"
          :max="transferData.balance"
          small
          :error="amountError"
          type="number"
          @update:modelValue="v$.amount.$touch"
        />

        <div class="w-100"></div>

        <BaseLabel forValue="Address" small>{{ $t(`account.wallets.walletsTab.withdrawal.address`) }}</BaseLabel>
        <Input
          label="Address"
          :placeholder="$t(`account.wallets.walletsTab.withdrawal.address`)"
          v-model="transfer.address"
          class="mb-4"
          small
          :error="addressError"
          @update:modelValue="v$.address.$touch"
        />
        <BaseLabel v-if="blockchain_networks.length > 1" small>{{
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
        <div class="w-100"></div>

        <BaseLabel forValue="Network Fee" small>{{ $t(`account.wallets.walletsTab.withdrawal.networkFee`) }}</BaseLabel>
        <Input
          label="Network Fee"
          :placeholder="$t(`account.wallets.walletsTab.withdrawal.networkFee`)"
          v-model="withdrawalCommission"
          class="mb-4"
          small
          disabled
        />

        <div class="w-100"></div>

        <BaseLabel forValue="You Get" small>{{ $t(`account.wallets.walletsTab.withdrawal.youGet`) }}</BaseLabel>
        <Input
          label="You Get"
          :placeholder="$t(`account.wallets.walletsTab.withdrawal.youGet`)"
          v-model="youGet"
          class="mb-4"
          small
          disabled
        />

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
      {{ $t(`account.wallets.walletsTab.withdrawal.continueBtn`) }}
    </BaseButton>

    <BaseButton type="button" color="secondary" class="ms-4" @click="getBack">
      {{ $t(`account.wallets.walletsTab.withdrawal.goBackBtn`) }}
    </BaseButton>
  </CardUi>

  <WithdrawalSuccess :info-data="withdrawalResult" v-else @return="getBack" />
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import Input from "@/components/base/BaseInput/BaseInput.vue";
import BaseLabel from "@/components/base/BaseLabel/BaseLabel.vue";
import BaseSelect from "@/components/base/BaseSelect/BaseSelect.vue";
import { trimFloatNumber } from "~~/utils/processNumbers";
import WithdrawalSuccess from "@/components/account/wallets/WithdrawalSuccess.vue";
import WarningNotification from "@/components/account/WarningNotification.vue";
import profile from "@/services/profile";
import { useUserStore } from "~~/stores/userStore";
import { useToast } from "@/library/vue-toast";
import useVuelidate from "@vuelidate/core";
import { required, minValue, maxValue, numeric } from "@vuelidate/validators";
import { useScroll } from "@vueuse/core";
const route = useRoute();
const userStore = useUserStore();

const $toast = useToast();
const localePath = useLocalePath();
const { t } = useI18n();
const props = defineProps({
  transferData: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["return"]);

const transfer = reactive({
  amount: null,
  address: "",
});

const rules = {
  amount: {
    required: {
      ...required,
      $message: t("account.wallets.walletsTab.withdrawal.withdrawalErrors.required"),
    },
    numeric: {
      ...numeric,
      $message: t("account.wallets.walletsTab.withdrawal.withdrawalErrors.numeric"),
    },
    minValue: {
      ...minValue(Number(props.transferData.min_withdrawal_amount)),
      $message: t("account.wallets.walletsTab.withdrawal.withdrawalErrors.minValue", {
        m$sg: props.transferData.min_withdrawal_amount,
      }),
    },
    maxValue: {
      ...maxValue(Number(props.transferData.balance)),
      $message: t("account.wallets.walletsTab.withdrawal.withdrawalErrors.maxValue", {
        m$sg: trimFloatNumber(props.transferData.balance),
      }),
    },
  },
  address: {
    required: {
      ...required,
      $message: t("account.wallets.walletsTab.withdrawal.withdrawalErrors.required"),
    },
  },
};

const v$ = useVuelidate(rules, transfer);
const onValidate = async () => await v$.value.$validate();

const isSuccess = ref(false);
const withdrawalResult = ref(null);

const amountError = computed(() => {
  if (v$.value.amount.$errors.length) return v$.value.amount.$errors[0].$message;
  return false;
});

const addressError = computed(() => {
  if (v$.value.address.$errors.length) return v$.value.address.$errors[0].$message;
  return false;
});

const youGet = computed(() => {
  if (isFinite(transfer.amount)) {
    return transfer.amount
      ? Number(trimFloatNumber(`${+transfer.amount - +props.transferData.withdrawal_commission}`))
      : "";
  }
  return "";
});

const withdrawalCommission = computed(() =>
  props.transferData.withdrawal_commission ? +props.transferData.withdrawal_commission : ""
);

async function send() {
  const isValid = await onValidate();
  if (isValid && userStore.verifiedUser) {
    const dataRequest = {
      amount: transfer.amount,
      address: transfer.address,
      currency: props.transferData.currency,
    };
    if (blockchain_networks.value?.length > 0) {
      dataRequest.blockchain_network = selectedBlockchainNetwork.value?.name;
    }
    try {
      withdrawalResult.value = await profile.sendWithdrawal(dataRequest).then((res) => ({
        ...res.data,
        currency: props.transferData.currency,
      }));
      isSuccess.value = true;
      $toast.success(t("common.toast.success"), { position: "top-right" });
      useScroll(document.querySelector("body"), {
        behavior: "smooth",
      });
    } catch (e) {
      $toast.warning(e.response._data.message, { position: "top-right" });
    }
  }
}
function getBack() {
  navigateTo({
    query: {
      action: "wallets",
    },
  });
  emits("return");
}
const activeWithDraw = computed(() => {
  return route?.query?.withdraw;
});
watch(activeWithDraw, (newValue, oldValue) => {
  if (newValue == undefined && oldValue) {
    emits("return");
  }
});
const selectedBlockchainNetwork = ref(null);
const blockchain_networks = computed(
  () => props.transferData.currencyDetails.blockchain_networks?.map((network) => ({ name: network })) || []
);
onMounted(async () => {
  const { data: user } = await profile.getUserProfile();
  await userStore.SET_USER(user);

  if (props.transferData.currencyDetails.blockchain_networks?.length > 0) {
    selectedBlockchainNetwork.value = { name: props.transferData.currencyDetails.blockchain_networks[0] };
  }
});
function chooseBlockchainNetwork(network) {
  selectedBlockchainNetwork.value = network;
}
</script>

<style lang="scss" scoped>
.balance-value {
  color: $color-primary;
}
</style>
