<template>
  <div class="wallets__add">
    <BaseButton v-if="!isOpened" type="button" @click="isOpened = !isOpened">
      {{ $t(`account.wallets.walletsTab.addWalletBtn`) }}
    </BaseButton>

    <div class="wallets__add-wallet" v-if="isOpened">
      <Select
        :selectList="currencyListFiltered"
        :selectedItem="currentCurrency"
        :border="true"
        @update:selectedItem="currentCurrency = $event"
        isIcons
      />

      <BaseButton type="button" @click="confirm">{{ $t("common.btns.confirm") }}</BaseButton>
      <BaseButton type="button" color="secondary" @click="isOpened = !isOpened">
        {{ $t(`account.wallets.walletsTab.addWalletCancel`) }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import Select from "@/components/base/BaseSelect/BaseSelect.vue";
import profile from "@/services/profile";
import { computed, ref } from "vue";
import { useWalletsStore } from "@/stores/userWallets";
const walletsStore = useWalletsStore();
const currentCurrency = ref({});
const isOpened = ref(false);
const emits = defineEmits("createdWallet");
const currencyListFiltered = computed(() => {
  const arr = walletsStore.currencies.filter(
    (cur) => !walletsStore.wallets?.find((wallet) => wallet.currency.code == cur.code)
  );
  currentCurrency.value = arr[0];
  return arr;
});

async function confirm() {
  await profile.createNewWallet({ currency: currentCurrency.value.code });
  emits("createdWallet");
}
</script>

<style lang="scss" scoped>
.wallets__add {
  display: flex;
  height: 45px;
}
.wallets__add-wallet {
  display: grid;
  grid-template-columns: 200px 150px 150px;
  gap: 20px;
  @include media-breakpoint-down("md") {
    grid-template-columns: 120px 100px 100px;
    gap: 10px;
  }
  //@include media-breakpoint-down("sm") {
  //  gap: 10px;
  //}
}
</style>
