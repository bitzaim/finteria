<template>
  <div v-if="isLoading"></div>
  <template v-else>
    <CardUi in-content>
      <Filters
        :currentCurrency="filterCurrency"
        :transactionType="filterTransaction"
        :date="filterDate"
        :transaction-types="i18nTransactionNames"
        @updateCurrency="updateCurrency"
        @updateTransaction="updateTransaction"
        @updateDate="updateDate"
      />
    </CardUi>

    <TableUi :rows="transactions" :columns="columns">
      <template v-slot="{ row, prop }">
        <template v-if="prop === 'amount'">
          {{ `${trimFloatNumber(row.amount)} ${row?.currency?.toUpperCase()}` }}
        </template>
        <template v-if="prop === 'type'">
          <div class="text-center">
            {{ getTransactionName(row.type) }}
          </div>
        </template>
      </template>
    </TableUi>

    <AccountTablePagination v-if="transactions?.length" :meta="transactionMeta" @update="updatePage" />
  </template>
</template>

<script setup>
import TableUi from "@/components/account/AccountTable.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import Filters from "@/components/account/wallets/Filters.vue";
import { computed, reactive, ref } from "vue";
import profile from "@/services/profile";
import AccountTablePagination from "@/components/account/AccountTablePagination.vue";
import { trimFloatNumber } from "~~/utils/processNumbers";
const i18n = useI18n();
const transactions = ref([]);
const transactionMeta = ref(null);
const i18nMessages = computed(() => i18n.messages.value[i18n.locale.value].account.wallets.transactionsTab);
const i18nTransactionNames = computed(
  () => i18n.messages.value[i18n.locale.value].account.wallets.filters.transactionTypes
);
const columns = computed(() => i18nMessages.value.columns);
const filters = reactive({
  page: 1,
  currency: null,
  type: null,
  from_date: null,
  to_date: null,
  direction: null,
  limit: 10,
});

const filterCurrency = ref(null);
const filterTransaction = ref(null);
const filterDate = ref(null);

function updatePage(val) {
  filters.page = val;
}

function updateCurrency(cur) {
  filterCurrency.value = cur;
  filters.currency = cur ? cur.code : null;
  updatePage(1);
}
function updateTransaction(val) {
  filterTransaction.value = val;
  filters.type = val ? val?.value : null;
  updatePage(1);
}
function updateDate(arr) {
  if (arr && arr.length) {
    let d1 = new Date(arr[0]);
    let d2 = new Date(arr[1]);
    let ye1 = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d1);
    let ye2 = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d2);
    let mo1 = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d1);
    let mo2 = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d2);
    let da1 = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d1);
    let da2 = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d2);

    filterDate.value = arr;
    filters.from_date = `${ye1}-${mo1}-${da1} 00:00:00`;
    filters.to_date = `${ye2}-${mo2}-${da2} 23:59:59`;
  } else {
    filterDate.value = null;
    filters.from_date = null;
    filters.to_date = null;
  }
  updatePage(1);
}

function getTransactionName(value) {
  if (i18nTransactionNames.value[value]) {
    return i18n.rt(i18nTransactionNames.value[value]);
  } else {
    return "";
  }
}

async function init() {
  const { data, links, meta } = await profile.fetchTransactions({
    page: filters.page,
    currency: filters.currency,
    type: filters.type,
    from_date: filters.from_date,
    to_date: filters.to_date,
    direction: filters.direction,
    limit: filters.limit,
  });

  transactions.value = data;
  transactionMeta.value = { ...links, ...meta };
  isLoading.value = false;
}

const isLoading = ref(true);
onMounted(() => {
  init();
});

watch(filters, () => {
  init();
});
</script>
