<template>
  <CardUi in-content>
    <Filters />
  </CardUi>

  <TableUi :rows="rows" :columns="columns"></TableUi>
</template>

<script setup>
import TableUi from "@/components/account/AccountTable.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import Filters from "@/components/account/wallets/Filters.vue";
import { computed } from "vue";

const i18n = useI18n();
const columns = computed(() => i18n.messages.value[i18n.locale.value].account.wallets.ordersTab.columns);

const rows = [
  {
    id: "CWT-125243",
    date: "16 May 2021, 21:09",
    status: "Pending",
    amount: "108.07 EUR",
    type: "Transfer",
  },
  {
    id: "CWT-125243",
    date: "16 May 2021, 21:09",
    status: "Pending",
    amount: "108.07 EUR",
    type: "Transfer",
  },
  {
    id: "CWT-125243",
    date: "16 May 2021, 21:09",
    status: "Cancel",
    amount: "108.07 EUR",
    type: "Transfer",
  },
];
</script>
