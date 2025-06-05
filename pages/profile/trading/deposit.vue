<script setup>
import Deposit from "~~/components/account/trading/Deposit.vue";
import { path } from "~~/constants/routes";
import { useTradingStore } from "~~/stores/userTradingAccounts";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import profile from "~~/services/profile";
import { useToast } from "~~/library/vue-toast";
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

const route = useRoute();
const tradingStore = useTradingStore();
const $toast = useToast();
const { t } = useI18n();

const isLoading = ref(true);
const message = ref(null);
// const message = ref(t(`account.trading.depositFirstPage.depositIsProcessing`));
const isInvoiceOpened = ref(null);
const access = ref(false);
const userStore = useUserStore();

async function init() {
  isLoading.value = true;
  if (!tradingStore.account?.external_id) {
    isInvoiceOpened.value = true;
    access.value = true;
    try {
      let res = await profile.fetchTradingAccounts();
      const queryId = route.query.id;
      const findDepositIdByExternalId = res.find((account) => account.external_id == queryId);
      console.log("findDepositIdByExternalId", findDepositIdByExternalId);
      const tradingAccount = findDepositIdByExternalId;
      if (tradingAccount?.group === "demo") {
        message.value = t(`account.trading.depositFirstPage.demoDepositUnavaliable`);
        return;
      }
      if (tradingAccount?.open_trader_invoice?.crypto_deposit) {
        tradingStore.SET_EXECUTED_INVOICE(tradingAccount.open_trader_invoice);
        if (tradingAccount?.open_trader_invoice?.funding_source === "crypto") {
          navigateTo({ path: localePath(path.account.address), replace: true });
        } else if (tradingAccount?.open_trader_invoice?.funding_source === "card") {
          navigateTo({ path: localePath(path.account.trading), replace: true });
        } else {
          tradingStore.SET_ACCOUNT(tradingAccount);
          isInvoiceOpened.value = false;
        }
      } else {
        tradingStore.SET_ACCOUNT(tradingAccount);
        isInvoiceOpened.value = false;
        navigateTo({
          path: localePath(path.account.deposit),
          replace: true,
          query: { id: route.query.id, payment: route.query.payment },
        });
      }
    } catch (error) {
      if (error?.response?.status == 404) {
        showError({ statusCode: 404, statusMessage: "Deposit ID Not Found" });
      }
      message.value = t(`account.trading.depositFirstPage.depositError`);
      $toast.warning(error.response?.data?.message, { position: "top-right" });
    } finally {
      isLoading.value = false;
    }
  } else {
    access.value = true;
    isLoading.value = false;
    isInvoiceOpened.value = false;
  }
}

onMounted(() => {
  if (!userStore.isAuth) {
    navigateTo({
      path: localePath(path.auth.login),
      query: {
        next: `/profile/trading/deposit?id=${route.query?.id}`,
      },
    });
  }
  init();
});
</script>

<template>
  <div v-if="access">
    <template v-if="isInvoiceOpened">
      <h2 style="margin: 20px auto; text-align: center" v-if="message">{{ message }}</h2>
      <BaseLoader v-if="isLoading" />
    </template>
    <AccountWrapSubPage
      v-if="!isInvoiceOpened"
      :label="$t(`account.trading.subPages.deposit`)"
      @go-back="navigateBack"
      with-go-back
    >
      <Deposit @open-view="" />
    </AccountWrapSubPage>
  </div>
</template>
