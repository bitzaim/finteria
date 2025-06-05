<template>
  <AccountWrap v-if="isLoad">
    <AccountWrapSubPage :label="$t(`account.settings.settingsTitle`)" hideWhenMobile>
      <ul class="tab-container">
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          @click="updateModelValue(tab)"
          class="tab"
          :class="{ 'tab-active': tab.key === activeTab.key }"
        >
          <span>{{ tab.label }}</span>
        </li>
      </ul>
      <div>
        <Suspense>
          <template #fallback>
            <BaseLoader />
          </template>
          <template #default>
            <component :is="selectedComponent"></component>
          </template>
        </Suspense>
      </div>
    </AccountWrapSubPage>
  </AccountWrap>
</template>

<script setup>
import { ref, shallowRef, computed, defineAsyncComponent, watch } from "vue";

import AccountWrap from "@/components/account/AccountWrap.vue";
import AccountWrapSubPage from "@/components/account/AccountWrapSubPage.vue";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import { useUserStore } from "@/stores/userStore";
import { path } from "~~/constants/routes";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

const tabsLink = reactive({
  general: shallowRef(defineAsyncComponent(() => import("@/components/account/profile/AccountGeneral.vue"))),
  verification: shallowRef(defineAsyncComponent(() => import("@/components/account/profile/AccountVerification.vue"))),
  password: shallowRef(defineAsyncComponent(() => import("@/components/account/profile/AccountPassword.vue"))),
  sessions: shallowRef(defineAsyncComponent(() => import("@/components/account/profile/AccountSessions.vue"))),
});
const selectedComponent = computed(() => tabsLink[activeTab.value.key]);
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const tabs = computed(() => {
  const tabs = [];
  for (const [key, value] of Object.entries(i18n.messages.value[i18n.locale.value].account.settings.tabs)) {
    tabs.push({
      label: i18n.rt(value.label),
      key,
    });
  }
  return tabs;
});

const localePath = useLocalePath();
const activeTab = ref({});
const updateModelValue = (tab) => {
  navigateTo({
    query: {
      action: tab.key,
    },
  });
};

const userStore = useUserStore();
const isLoad = ref(false);

onMounted(() => {
  if (userStore.isAuth) {
    isLoad.value = true;
    const foundTab = tabs.value.find((tab) => tab.key == route.query?.action);
    activeTab.value = foundTab || tabs.value[0];
    router.replace({ query: { action: activeTab.value.key } });
  } else {
    const nextTab = route.query.action ? `?action=${route.query.action}` : "";
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
    const foundTab = tabs.value.find((tab) => tab.key == newValue.action) || tabs.value[0];
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
