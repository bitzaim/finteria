<script setup>
import TradingAccounts from "~~/components/account/trading/TradingAccounts.vue";
import AccountWrapSubPage from "~~/components/account/AccountWrapSubPage.vue";
import { useUserStore } from "@/stores/userStore";
import { path } from "~~/constants/routes";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

const localePath = useLocalePath();
const userStore = useUserStore();
const access = ref(false);
onMounted(() => {
  if (userStore.isAuth) {
    access.value = true;
  } else {
    navigateTo({
      path: localePath(path.auth.login),
      query: {
        next: "/profile/trading",
      },
    });
  }
});
</script>

<template>
  <div v-if="access" class="trading-accounts-wrap">
    <AccountWrapSubPage :label="$t(`account.trading.tradingAccounts.title`)" hideWhenMobile>
      <TradingAccounts />
    </AccountWrapSubPage>
  </div>
</template>

<style scoped>
.trading-accounts-wrap:deep(> .ui-card) {
  padding-bottom: 0;
}
</style>
