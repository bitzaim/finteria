<template>
  <AccountWrap v-if="access">
    <AccountWrapSubPage :label="$t(`account.wallets.title`)" hideWhenMobile>
      <AccountTabs :tabs="tabs" :modelValue="showPage" @update:modelValue="updateModelValue">
        <template #wallets>
          <TabWallet :wallets="walletsStore.wallets" @reset="throttledInit" />
        </template>
        <template #transactionsHistory>
          <TabTransaction />
        </template>
      </AccountTabs>
    </AccountWrapSubPage>
  </AccountWrap>
</template>

<script setup>
import AccountWrap from "@/components/account/AccountWrap.vue";
import AccountWrapSubPage from "@/components/account/AccountWrapSubPage.vue";
import AccountTabs from "@/components/account/AccountTabs.vue";
import TabWallet from "@/components/account/wallets/TabWallet";
import TabTransaction from "@/components/account/wallets/TabTransaction";
import { ref, computed, onMounted } from "vue";
import { useWebsockets } from "@/composition/useWebsockets";
import { useToast } from "@/library/vue-toast";
import { useWalletsStore } from "@/stores/userWallets";
import { useUserStore } from "@/stores/userStore";
import { path } from "~~/constants/routes";
import { throttle } from "@/utils/throttle";

definePageMeta({
  middleware: ["wallet-tabs"],
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
});

const route = useRoute();
const $toast = useToast();
const i18n = useI18n();
const localePath = useLocalePath();
const walletsStore = useWalletsStore();
useWebsockets([
  {
    name: ".WalletUpdated",
    callback: (e) => {
      updateWallet(e.model);
    },
  },
]);

function updateWallet(newWallet) {
  const updatedWallets = [];
  for (let index = 0; index < walletsStore.wallets.length; index++) {
    const element = walletsStore.wallets[index];
    if (element.id === newWallet.id) {
      updatedWallets.push(newWallet);
      continue;
    }
    updatedWallets.push(element);
  }
  walletsStore.SET_WALLETS(updatedWallets);
}

const activeTab = ref({});
const tabs = computed(() => {
  const tabs = [];
  for (const [key, value] of Object.entries(i18n.messages.value[i18n.locale.value].account.wallets.tabs)) {
    tabs.push({
      label: i18n.rt(value.label),
      key,
    });
  }
  return tabs;
});

//

const currentPage = computed(() => Object.values(route.query)[0]);
const showPage = computed(() => {
  return (
    tabs.value.find((element) => element.key === currentPage.value) || {
      label: "Wallets",
      key: "wallets",
    }
  );
});
const updateModelValue = (tab) => {
  navigateTo({
    query: {
      action: tab.key,
    },
  });
  activeTab.value = tab;
};

const getCurrentPageUrl = () => {
  const findElement = tabs.value.find((element) => element.key === currentPage.value);
  activeTab.value = findElement || tabs.value[0];
};

getCurrentPageUrl();
const throttledInit = throttle(init, 300);
async function init() {
  try {
    await walletsStore.FETCH_WALLETS();
    if (!walletsStore.currencies?.length > 0) {
      await walletsStore.FETCH_CURRENCIES();
    }
  } catch (e) {
    $toast.warning(e.response._data.message, { position: "top-right" });
  }
}

const userStore = useUserStore();
const access = ref(false);
onMounted(() => {
  if (userStore.isAuth) {
    access.value = true;
    throttledInit();
  } else {
    navigateTo({
      path: localePath(path.auth.login),
      query: {
        next: "/profile/wallets",
      },
    });
  }
});
</script>
