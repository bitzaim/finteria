<template>
  <AccountWrap>
    <AccountWrapSubPage :label="$t(`account.nav.loans`)" hideWhenMobile>
      <ul class="tab-container">
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          @click="updateModelValue(tab)"
          class="tab"
          :class="{ 'tab-active': tab.value === activeTab.value }"
        >
          <span>{{ tab.label }}</span>
        </li>
      </ul>
      <LoansList :active-tab="activeTab.value" />
    </AccountWrapSubPage>
  </AccountWrap>
</template>

<script setup>
import AccountWrap from "@/components/account/AccountWrap.vue";
import AccountWrapSubPage from "@/components/account/AccountWrapSubPage.vue";
import { useUserStore } from "@/stores/userStore";
import LoansList from "@/components/account/loans/LoansList.vue";

const route = useRoute();
const i18n = useI18n();
const localePath = useLocalePath();
const userStore = useUserStore();
const tabs = computed(() => i18n.messages.value[i18n.locale.value].account.loans.tabs);
const activeTab = ref({});
const router = useRouter();

const updateModelValue = (tab) => {
  navigateTo({
    query: {
      table: tab.value,
    },
  });
};

onMounted(() => {
  if (userStore.isAuth) {
    const foundTab = tabs.value.find((tab) => tab.value == route.query?.table);
    activeTab.value = foundTab || tabs.value[0];
    router.replace({ query: { table: activeTab.value.value } });
  } else {
    const nextTab = route.query.table ? `?table=${route.query.table}` : "";
    navigateTo({
      path: localePath(path.auth.login),
      query: {
        next: `profile${nextTab}`,
      },
    });
  }
});

watch(
  () => route.query,
  (newValue) => {
    const foundTab = tabs.value.find((tab) => tab.value == newValue.table);
    activeTab.value = foundTab;
  }
);
</script>

<style lang="scss" scoped>
.tab-container {
  display: flex;
  max-width: 100vw;
  margin-bottom: 0;

  overflow-x: auto;
  font-size: 13px;
  font-weight: 800;
  line-height: 140%;
  text-transform: uppercase;
  background-color: $color-primary-lightest;

  @include media-breakpoint-down("sm") {
    padding: 0px;
    font-size: 12px;
    font-weight: 700;
  }
}

.tab {
  position: relative;
  flex-shrink: 0;
  padding: 16px 30px;
  color: $color-primary;
  cursor: pointer;
  border-right: 1px solid $color-white;
  transition: background $transition-time;

  &:hover {
    background: darken($color-primary-lightest, 10%);

    &::after {
      position: absolute;
      top: 0;
      left: 50%;
      content: "";
      border-top: 6px solid $color-white;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      transform: translate(-50%, 0%);

      @include media-breakpoint-down("sm") {
        border-top: 6px solid $color-border-pre-dark-secondary;
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
      }
    }
  }

  @include media-breakpoint-down("sm") {
    flex-grow: 1;
    padding: 10px 0px;
    text-align: center;
  }
}

.tab-active {
  position: relative;
  color: $color-white;
  background-color: $color-primary;

  &:hover {
    background-color: $color-primary;
  }

  &::after {
    position: absolute;
    top: 0;
    left: 50%;
    content: "";
    border-top: 6px solid $color-white;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    transform: translate(-50%, 0%);

    @include media-breakpoint-down("sm") {
      border-top: 6px solid $color-border-pre-dark-secondary;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
    }
  }
}
</style>
