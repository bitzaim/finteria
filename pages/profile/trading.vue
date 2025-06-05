<template>
  <div>
    <AccountWrap>
      <NuxtPage />
    </AccountWrap>
  </div>
</template>

<script setup>
import AccountWrap from "@/components/account/AccountWrap.vue";
import { useWalletsStore } from "@/stores/userWallets";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

const walletsStore = useWalletsStore();
onBeforeMount(() => {
  if (!walletsStore.settings?.length) {
    walletsStore.FETCH_SETTINGS();
  }
});
</script>
