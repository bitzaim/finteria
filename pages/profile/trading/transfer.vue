<script setup>
import Transfer from "@/components/account/trading/Transfer.vue";
import TransferSuccess from "@/components/account/trading/TransferSuccess.vue";
import { path } from "@/constants/routes";
import { useUserStore } from "@/stores/userStore";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

const localePath = useLocalePath();
const wraps = reactive({
  actions: true,
  final: false,
});
const data = ref({});

function navigateBack() {
  navigateTo({ path: localePath(path.account.trading) });
}

function handleContinue(dataFromServer) {
  wraps.final = true;
  wraps.actions = false;
  data.value = dataFromServer;
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
        next: "/profile/trading/transfer",
      },
    });
  }
});
</script>

<template>
  <div>
    <AccountWrapSubPage
      v-if="access && wraps.actions"
      :label="$t(`account.trading.subPages.transfer`)"
      with-go-back
      @go-back="navigateBack"
    >
      <Transfer @reset="" @continue="handleContinue" />
    </AccountWrapSubPage>

    <AccountWrapSubPage
      v-if="access & wraps.final"
      with-go-back
      :label="$t(`account.trading.subPages.transfer`)"
      @go-back="navigateBack"
    >
      <TransferSuccess :data="data" />
    </AccountWrapSubPage>
  </div>
</template>
