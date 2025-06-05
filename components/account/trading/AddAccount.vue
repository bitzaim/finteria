<template>
  <div class="wallets__add">
    <div v-if="isLoading"></div>

    <BaseButton v-if="!isOpened" type="button" @click="isOpened = !isOpened">
      {{ $t("account.trading.tradingAccounts.addAccountBtn") }}
    </BaseButton>

    <div class="wallets__add-wallet" v-if="isOpened">
      <Select
        v-if="false"
        :selectList="types"
        :selectedItem="accountData.type"
        :border="true"
        @update:selectedItem="accountData.type = $event"
        placeholder="Type"
        data-label="label"
        data-value="value"
        small
        :upper-case="false"
      />
      <Select
        v-if="currencyListFiltered?.length"
        :selectList="currencyListFiltered"
        :selectedItem="accountData.currentCurrency"
        :border="true"
        @update:selectedItem="updateCurrency"
        isIcons
      />
      <BaseButton type="button" @click="confirm">{{ $t("common.btns.confirm") }}</BaseButton>
      <BaseButton type="button" @click="isOpened = !isOpened">{{ $t("common.btns.cancel") }}</BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import Select from "@/components/base/BaseSelect/BaseSelect.vue";
import profile from "@/services/profile";
import { computed, reactive, ref } from "vue";
import { useWalletsStore } from "@/stores/userWallets";
import { useToast } from "@/library/vue-toast";
const $toast = useToast();

const props = defineProps(["rows"]);

const platforms = [
  { label: "Option", value: "options" },
  { label: "Margin", value: "mt" },
];

const types = [
  { label: "Live", value: "live" },
  { label: "Demo", value: "demo" },
];

const walletsStore = useWalletsStore();
const emits = defineEmits("createdAccount");
const accountData = reactive({
  currentCurrency: {},
  platform_type: "",
  type: "",
});
const isOpened = ref(false);
const currencyListFiltered = computed(() => {
  const tradable = walletsStore.currencies?.filter((cur) => cur.is_tradable);
  const crypto = tradable.filter((item) => item.is_crypto);
  const fiat = tradable.filter((item) => !item.is_crypto);
  const output = [...fiat, ...crypto];
  if (accountData.type?.value === "live" && props.rows.length && accountData.platform_type) {
    const buffer = output.filter((currency) => {
      return !props.rows.some((row) => {
        return row.currency === currency.code && row.platform_type === accountData.platform_type.value;
      });
    });
    return buffer;
  }

  return output;
});

async function confirm() {
  try {
    const { data } = await profile.createTradingAccount({
      currency: accountData.currentCurrency.code,
      platform_type: accountData.platform_type.value,
      group_type: accountData.type.value,
    });
    emits("createdAccount", data);
    isOpened.value = false;
  } catch (e) {
    $toast.warning(e.data.message, { position: "top-right" });
  }
}

function updateCurrency(val) {
  accountData.currentCurrency = val;
}

async function init() {
  if (!walletsStore.currencies?.length > 0) {
    await walletsStore.FETCH_CURRENCIES();
  }
  accountData.currentCurrency = currencyListFiltered.value[0];
  accountData.platform_type = platforms[0];
  accountData.type = types[0];
  isLoading.value = false;
}
const isLoading = ref(true);
onMounted(() => {
  init();
});

watch(
  () => [currencyListFiltered.value],
  () => {
    accountData.currentCurrency = currencyListFiltered.value[0];
  }
);
</script>

<style lang="scss" scoped>
.wallets__add {
  display: flex;
  height: 45px;
  @include media-breakpoint-down("md") {
    height: auto;
  }
}
.wallets__add-wallet {
  display: grid;
  grid-template-columns: 200px 200px 150px 150px;
  gap: 20px;
  @include media-breakpoint-down("lg") {
    grid-template-columns: 120px 120px 100px 100px;
  }
  @include media-breakpoint-down("sm") {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
}
</style>
