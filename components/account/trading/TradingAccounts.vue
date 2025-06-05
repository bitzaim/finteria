<template>
  <AppLoader v-if="tradingStore.isLoading" class="mt-5" />

  <div v-else>
    <BaseCard in-content class="ui-card--shadowed">
      <AddAccount @createdAccount="updateTradingAccount" :rows="rowsFiltered" />
    </BaseCard>

    <AppLoader v-if="rows?.length < 1" class="mt-5" />
    <AccountTable v-else :rows="rowsFiltered" :columns="columns">
      <template v-slot="{ row, prop }">
        <template v-if="prop === 'external_id'">
          <span v-if="row[prop]">{{ row[prop] }}</span>
          <AppLoader v-else inline :with-text="false" />
        </template>
        <template v-if="prop === 'balance'">
          <span>{{ trimFloatNumber(row[prop], walletsStore.getCurrencyVisualDivisibility(row.currency)) }}</span>
        </template>
        <template v-if="prop === 'bonus'">
          <span>{{ trimFloatNumber(row[prop], walletsStore.getCurrencyVisualDivisibility(row.currency)) }}</span>
        </template>
        <template v-if="prop === 'currency'">
          <img :src="`/icons/${row[prop]}.svg`" alt="" class="currency__img me-1" />
          <div class="d-inline-block">{{ row[prop].toUpperCase() }}</div>
        </template>
        <template v-if="prop === 'btns'">
          <div class="d-flex justify-content-end justify-content-lg-end gap-1 row-buttons__wrapper">
            <BaseButton
              v-if="row.group !== 'demo'"
              color="secondary"
              type="button"
              :disabled="!row.external_id"
              @click="deposit(row)"
            >
              {{ $t(`account.trading.tradingAccounts.btnDeposit`) }}
            </BaseButton>

            <BaseButton
              v-if="row.group !== 'demo'"
              color="tertiary"
              type="button"
              :disabled="!row.external_id || !row.can_withdraw"
              @click="withdraw(row)"
            >
              {{ $t(`account.trading.tradingAccounts.btnWithdraw`) }}
            </BaseButton>

            <BaseButton
              color="secondary"
              type="button"
              :disabled="!row.external_id || isRedirecting"
              @click="handleRedirect(row)"
            >
              {{ $t("cryptocurrency.trade") }}
            </BaseButton>
          </div>
        </template>
      </template>
    </AccountTable>
  </div>

  <BaseModal v-model="isDepositModal" prevent-click-outside>
    <ModalPaymentCard v-if="!mockCard" @close="isDepositModal = false" @continue="mockCard = true" />
    <ModalDepositWithCard
      v-else
      @cancel="
        (id) => {
          isDepositModal = false;
          syncCancellation(id);
        }
      "
    />
  </BaseModal>

  <ModalPaybis v-model="isOpenPaybisModal" @cancel="onPaybisCancel" />
</template>

<script setup>
import BaseCard from "@/components/base/BaseCard/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import AccountTable from "@/components/account/AccountTable.vue";
import AddAccount from "@/components/account/trading/AddAccount.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import { computed, ref, onUnmounted } from "vue";
import profile from "@/services/profile";
import { redirectToPlatform } from "~~/services/helpers";
import { useTradingStore } from "@/stores/userTradingAccounts";
import BaseModal from "@/components/base/BaseModal/BaseModal.vue";
import ModalPaymentCard from "./ModalPaymentCard.vue";
import ModalDepositWithCard from "./ModalDepositWithCard.vue";
import ModalPaybis from "@/components/account/trading/ModalPaybis.vue";
import { useWebsockets } from "~~/composition/useWebsockets";
import { deepEqual } from "@/utils/utilsObjects";
import { trimFloatNumber } from "@/utils/processNumbers";
import { useWalletsStore } from "@/stores/userWallets";

const tradingStore = useTradingStore();
const emits = defineEmits(["openView"]);
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});

useWebsockets([
  {
    name: ".TraderAccountCreated",
    callback: (e) => {
      updateTradingAccount(e.model);
    },
  },
  {
    name: ".TraderAccountUpdated",
    callback: (e) => {
      updateTradingAccount(e.model);
    },
  },
]);

const i18n = useI18n();
const walletsStore = useWalletsStore();
const localePath = useLocalePath();

//@ts-ignore
const i18nMessages = computed(() => i18n.tm(`account.trading`) || []);
const columnConstants = ["external_id", "group", "currency", "balance", "bonus", "btns"];

const columns = computed(() => {
  const obj = {};
  for (const column of columnConstants) {
    obj[column] = i18nMessages.value.tradingAccounts.columns[column] || "";
  }
  return obj;
});

const rowsFiltered = computed(() => {
  const sortedLiveFirst = [...rows.value, mockTradingAccount.value].sort((a, b) => {
    if (a.group === "live" && b.group === "live") {
      const difference = b.external_id - a.external_id;
      return a.external_id === null ? -1 : b.external_id === null ? 1 : difference;
    } else if (a.group === "live" && b.group === "demo") {
      return -1;
    } else if (a.group === "demo" && b.group === "demo") {
      const difference = b.external_id - a.external_id;
      return a.external_id === null ? -1 : b.external_id === null ? 1 : difference;
    } else {
      return 1;
    }
  });

  return sortedLiveFirst;
});

const mockTradingAccount = computed(() => {
  if (rows.value.length) {
    const lastExternal_id = rows.value.reduce((acc, row) => (row.external_id > acc ? row.external_id : acc), 0);
    const findUserId = rows.value.find((el) => el.id);
    return {
      id: findUserId.id,
      external_id: lastExternal_id + 1,
      balance: "10000",
      withdrawable_balance: "10000",
      bonus: "0",
      currency: "usd",
      group: "demo",
      can_withdraw: 1,
      created_at: "",
      active_promo_bonus: null,
      open_trader_invoice: null,
      mock: true,
    };
  } else {
    return {};
  }
});

const isRedirecting = ref(false);
const rows = ref([]);
const mockCard = ref(false);

const isDepositModal = ref(false);
const isOpenPaybisModal = ref(false);

function withdraw(row) {
  tradingStore.SET_ACCOUNT(row);
  navigateTo({ path: localePath(`/profile/trading/withdraw/${row.id}`) });
}

function deposit(row) {
  if (row.open_trader_invoice?.funding_source === "crypto" && row.open_trader_invoice?.crypto_deposit) {
    tradingStore.SET_EXECUTED_INVOICE(row.open_trader_invoice);
    navigateTo({ path: localePath(`/profile/trading/address`) });
  } else if (row.open_trader_invoice?.funding_source === "card" && row.open_trader_invoice?.crypto_deposit) {
    tradingStore.SET_EXECUTED_INVOICE(row.open_trader_invoice);
    // TODO: need to fix after get available payment gateways
    // isDepositModal.value = true;
    isOpenPaybisModal.value = true;
  } else {
    tradingStore.SET_ACCOUNT(row);
    navigateTo({
      path: localePath(`/profile/trading/deposit`),
      query: {
        id: row.external_id,
      },
    });
  }
}

async function init() {
  tradingStore.SET_FETCHING(true);
  try {
    const data = await profile.fetchTradingAccounts();
    const withoutExpired = data.filter((obj) => obj.is_expired !== true);
    rows.value = withoutExpired;
  } catch (e) {
    console.dir(e);
  } finally {
    tradingStore.SET_FETCHING(false);
  }
  if (tradingStore.executedInvoive?.funding_source === "card") {
    // TODO: need to fix after get available payment gateways
    // isDepositModal.value = true;
    isOpenPaybisModal.value = true;
  }
}

async function handleRedirect(row) {
  const windowRef = window.open("", "_self");
  const myUrl = await redirectToPlatform(row);
  windowRef.location.href = myUrl;
}

function syncCancellation(invoiceId) {
  if (!invoiceId) {
    throw Error("Could'nt find invoice id to cancellation");
  }

  const foundIndex = rows.value.findIndex((acc) => {
    return acc.open_trader_invoice?.id === invoiceId;
  });

  if (foundIndex !== -1) {
    rows.value[foundIndex].open_trader_invoice = null;
  }
}

onMounted(() => {
  init();
});

onUnmounted(() => {
  if (tradingStore.executedInvoive?.id && tradingStore?.executedInvoive?.funding_source !== "crypto") {
    tradingStore.SET_EXECUTED_INVOICE({});
  }
});

function updateTradingAccount(newRow) {
  console.log("functions start", newRow);
  const newIndex = rows.value.findIndex((row) => row.id === newRow.id);
  if (newIndex === -1) {
    console.log("newIndex -1");
    rows.value.push(newRow);
  } else {
    console.log("newIndex == ", newIndex);
    if (deepEqual(newRow, rows.value[newIndex])) {
      console.log("isEqual");
      return;
    } else {
      console.log("changed");
      rows.value[newIndex] = newRow;
    }
  }
}

const onPaybisCancel = (id) => {
  isOpenPaybisModal.value = false;
  syncCancellation(id);
};

watch(
  () => tradingStore.executedInvoive.crypto_deposit,
  async () => {
    try {
      tradingStore.SET_FETCHING(true);
      const data = await profile.fetchTradingAccounts();
      const withoutExpired = data.filter((obj) => obj.is_expired !== true);
      rows.value = withoutExpired;
    } catch (e) {
      console.dir(e);
    } finally {
      tradingStore.SET_FETCHING(false);
    }
  }
);
</script>

<style lang="scss" scoped>
.currency__img {
  width: 20px;
  height: 20px;
}

.plaftorm__img {
  width: 20px;
  height: 20px;
}

.row-buttons__wrapper {
  @include media-breakpoint-down("md") {
    justify-content: flex-end !important;
    padding: 12px 0;
  }

  button {
    padding: 10px 22px;
    @include media-breakpoint-down("md") {
      padding: 6px 8px;
      font-weight: 400;
    }
  }
}
</style>
