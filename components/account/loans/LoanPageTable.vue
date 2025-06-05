<template>
  <div class="row mb-3" v-for="row in rows" :key="row.label">
    <div class="col">{{ row.label }}</div>
    <div class="col-auto">{{ userLoans.properties[row.field] }}</div>
  </div>
</template>

<script setup>
import { useLoansStore } from "@/stores/userLoans";
const userLoans = useLoansStore();

defineProps({
  rows: {
    required: true,
    type: Array,
  },
});
</script>
