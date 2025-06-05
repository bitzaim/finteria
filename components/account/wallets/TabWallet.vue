<template>
  <AppLoader v-if="isLoading" class="mt-5" />

  <Deposit v-else-if="deposit.id" :deposit="deposit" @return="init" />

  <Withdrawal v-else-if="withdrawalState" :transferData="withdrawalState" @return="init" />

  <div v-else>
    <CardUi in-content>
      <div class="d-flex flex-column flex-sm-row justify-content-between mb-2">
        <p>
          {{ $t(`account.wallets.walletsTab.estimatedBalance`) }}:
          <b>~${{ estimatedBalance }}</b>
        </p>
        <div class="mb-2 d-sm-none"></div>
        <CheckBox v-model="hideSmallBalance" class="ml-auto">
          {{ $t(`account.wallets.walletsTab.hideSmallBalances`) }}
        </CheckBox>
        <div class="mb-2 d-sm-none"></div>
      </div>

      <AddWallet @createdWallet="init" />
    </CardUi>

    <TableUi v-if="walletsTransformed.length" :rows="walletsTransformed" :columns="columns">
      <template v-slot="{ row, prop }">
        <template v-if="prop === 'currency'">
          <div class="d-flex">
            <img v-if="row?.currency" class="me-2" height="20" :src="`/icons/${row.currency.code.toLowerCase()}.svg`" />
            <span class="currency_column">{{ row?.currency?.display_code?.toUpperCase() }}</span>
          </div>
        </template>

        <template v-if="prop === 'balance'">
          {{ trimFloatNumber(row.balance) }} <br />
          <span v-if="+row.balance_usd" class="wallets__row-small">~${{ trimFloatNumber(row.balance_usd, 2) }}</span>
        </template>

        <template v-if="prop === 'btns'">
          <div class="d-flex justify-content-start justify-content-lg-end gap-1 row-buttons__wrapper">
            <template v-if="row.currency?.is_crypto">
              <BaseButton type="button" color="secondary" @click="fetchDeposit(row)">
                {{ $t(`account.wallets.walletsTab.btnDeposit`) }}
              </BaseButton>

              <BaseButton
                type="button"
                color="tertiary"
                @click="changeNavigateWithdraw(row)"
                :disabled="!row.withdrawal"
              >
                {{ $t(`account.wallets.walletsTab.btnWithdraw`) }}
              </BaseButton>
            </template>

            <BaseButton type="button" color="tertiary" @click="redirectToExchange(row)">
              {{ $t(`account.wallets.walletsTab.btnExchange`) }}
            </BaseButton>
          </div>
        </template>
      </template>
    </TableUi>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import TableUi from "@/components/account/AccountTable.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import Deposit from "@/components/account/wallets/Deposit.vue";
import AddWallet from "@/components/account/wallets/AddWallet.vue";
import Withdrawal from "@/components/account/wallets/Withdrawal.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import CheckBox from "@/components/base/BaseCheckbox/BaseCheckbox.vue";
import profile from "@/services/profile";
import { trimFloatNumber } from "~~/utils/processNumbers";
import { useToast } from "@/library/vue-toast";
import emitter from "@/library/eventBus";
import { useScroll } from "@vueuse/core";
import { useWalletsStore } from "@/stores/userWallets";
import { path } from "~~/constants/routes";

const $toast = useToast();
const walletsStore = useWalletsStore();
const route = useRoute();
const props = defineProps({
  wallets: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["reset"]);

const localePath = useLocalePath();
const i18n = useI18n();
const columnConstants = ["currency", "balance", "locked_balance", "btns"];

const columns = computed(() => {
  const obj = {};
  for (const column of columnConstants) {
    obj[column] = i18n.messages.value[i18n.locale.value].account.wallets.walletsTab.columns[column] || "";
  }
  return obj;
});

const isLoading = ref(true);
const deposit = reactive({
  id: null,
  address: "",
  blockchain_networks: null, // null | []
  currency: null,
  type: "permanent", // permanent || rotational,
  available_until: null,
});

const wallets = ref([]);
const withdrawalFetchedData = ref([]);
const withdrawalState = ref(null);
const hideSmallBalance = ref(false);

const walletsTransformed = computed(() =>
  props.wallets
    .map((wallet) => ({
      ...wallet,
      locked_balance: 0,
      locked_balance_usd: 0,
      withdrawal: withdrawalFetchedData.value.find((item) => item.currency === wallet.currency.code),
    }))
    .filter((wallet) => (hideSmallBalance.value ? Number(wallet.balance_usd) > 0 : true))
);

const estimatedBalance = computed(() =>
  props.wallets
    .map((wallet) => Number(wallet.balance_usd))
    .reduce((prev, next) => prev + next, 0)
    .toFixed(2)
);

async function init() {
  emits("reset");
  deposit.id = null;
  withdrawalState.value = null;
  isLoading.value = true;
  try {
    withdrawalFetchedData.value = await profile.getWithdrawalData().then((res) => res.data);
  } catch (e) {
    $toast.warning(e?.response?._data?.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
}
function changeNavigateDeposit(row) {
  navigateTo({
    query: {
      action: "wallet",
      deposit: row.id,
    },
  });
  return row;
}
function changeNavigateWithdraw(row) {
  navigateTo({
    query: {
      action: "wallet",
      withdraw: row.id,
    },
  });
  choosedWithDraw.value = row;
}

async function fetchDeposit(row) {
  deposit.id = row.id;
  deposit.currency = row.currency;
  deposit.blockchain_networks = row.currency.blockchain_networks;
  changeNavigateDeposit(row);
  useScroll(document.querySelector("body"), {
    behavior: "smooth",
  });
}

function openWithdrawal(item) {
  withdrawalState.value = {
    ...item.withdrawal,
    currencyDetails: item.currency,
    balance: item.balance,
  };
  useScroll(document.querySelector("body"), {
    behavior: "smooth",
  });
}

function redirectToExchange({ currency }) {
  walletsStore.SET_EXCHANGING_CURRENCY(currency);
  navigateTo({ path: localePath(path.account.exchange) });
}

emitter.on("changeTab", (tab) => {
  // временное решение до смены компонента table
  init();
});

onMounted(() => {
  init();
});

const choosedWithDraw = ref({});
const activeWithDraw = computed(() => {
  return route.query?.withdraw;
});
watch(activeWithDraw, (newValue, oldValue) => {
  if (newValue && oldValue == undefined) {
    openWithdrawal(choosedWithDraw.value);
  }
});

if (route.query?.deposit) {
  const { data } = await profile.getProfileWallets();
  let wallet = data.find((wallet) => route.query?.deposit == wallet.id);
  fetchDeposit(wallet);
}
onMounted(async () => {
  if (route.query?.withdraw) {
    try {
      const response = await profile.getWithdrawalData();
      const { data } = await profile.getProfileWallets();

      let wallet = data.find((wallet) => route.query?.withdraw == wallet.id);
      let withdraw = response.data.find((item) => item.currency === wallet.currency.code);

      withdrawalState.value = {
        ...wallet,
        ...withdraw,
        currencyDetails: wallet.currency,
      };
    } catch (error) {
      console.log(error);
    }
  }
});
</script>

<style lang="scss" scoped>
.currency_column {
  display: inline-block;
  width: 50px;
}

.wallets__row-small {
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  color: $color-grey;
}
.row-buttons__wrapper {
  @include media-breakpoint-down("md") {
    justify-content: flex-end !important;
    padding: 12px 0;
  }
}
</style>
