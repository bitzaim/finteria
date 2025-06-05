<script setup>
import DepositSuccess from "~~/components/account/trading/DepositSuccess.vue";
import { path } from "~~/constants/routes";
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
  <div v-if="access">
    <AccountWrapSubPage :label="$t(`account.trading.subPages.depositTransaction`)" with-go-back @go-back="navigateBack">
      <DepositSuccess @reset="navigateBack" />
    </AccountWrapSubPage>
  </div>
</template>
