<template>
  <div class="container">
    <button @click="toggleFilters" class="d-sm-none border-0 bg-transparent">
      <IconFilter />
      {{ $t(`account.wallets.filters.title`) }}
    </button>
  </div>

  <div class="container" v-show="isOpen">
    <div class="row gap-3 gap-lg-0 mt-4 mt-sm-0">
      <div class="col-lg-4">
        <h6 class="">{{ $t(`account.wallets.filters.allCurrency`) }}</h6>
        <SelectUI
          :selectList="walletsStore.getUserCurrencies"
          :selectedItem="currentCurrency"
          :border="true"
          @update:selectedItem="updateCurrency"
          isIcons
          small
          placeholder="All Currency"
          clearable
        />
      </div>
      <div class="col-lg-4">
        <h6>{{ $t(`account.wallets.filters.transactionType`) }}</h6>

        <SelectUI
          :selectList="transactionTypesTransformed"
          :selectedItem="transactionType"
          :border="true"
          @update:selectedItem="updateTransaction"
          small
          placeholder="All Types"
          clearable
          data-label="label"
          data-value="value"
        />
      </div>
      <div class="col-lg-4">
        <h6>{{ $t(`account.wallets.filters.period`) }}</h6>
        <BaseDatepicker v-model="filterDate" range />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectUI from "@/components/base/BaseSelect/BaseSelect.vue";
import BaseDatepicker from "@/components/base/BaseDatepicker/BaseDatepicker.vue";
import { useWalletsStore } from "@/stores/userWallets";
import IconFilter from "@/components/icons/IconFilter.vue";
const walletsStore = useWalletsStore();
const emits = defineEmits(["updateCurrency", "updateTransaction", "updateDate"]);
const props = defineProps(["currentCurrency", "transactionTypes", "transactionType", "date"]);
const isOpen = ref(true);
const { rt } = useI18n();

const filterDate = computed<Date>({
  get() {
    return props.date || "";
  },
  set(value) {
    emits("updateDate", value);
  },
});

const transactionTypesTransformed = computed(() => {
  return Object.keys(props.transactionTypes).map((type) => {
    return {
      label: rt(props.transactionTypes[type]),
      value: type,
    };
  });
});

const toggleFilters = () => (isOpen.value = !isOpen.value);
const updateCurrency = (val) => emits("updateCurrency", val);
const updateTransaction = (val) => emits("updateTransaction", val);
</script>
