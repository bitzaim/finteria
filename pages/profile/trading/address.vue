<script setup>
import { path } from "~~/constants/routes";
import AccountWrapSubPage from "~~/components/account/AccountWrapSubPage.vue";
import DepositTransaction from "~~/components/account/trading/DepositTransaction.vue";
import { useUserStore } from "@/stores/userStore";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})
const localePath = useLocalePath();

function navigateBack() {
  navigateTo({ path: localePath(path.account.trading) });
}
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
  <div>
    <AccountWrapSubPage :label="$t(`account.trading.subPages.depositTransaction`)" @go-back="navigateBack" with-go-back>
      <DepositTransaction />
    </AccountWrapSubPage>
  </div>
</template>
