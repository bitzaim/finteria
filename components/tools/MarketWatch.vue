<template>
  <section class="market-watch">
    <h3 class="market-watch__title">
      <slot />
    </h3>

    <ul class="market-watch__tabs-list">
      <li class="market-watch__tabs-item" v-for="(tab, tabIdx) in sortedTabs" :key="`tab-${tab.slug}`">
        <button
          class="market-watch__tab"
          :class="{
            'market-watch__tab_active': currentTabIndex === tabIdx,
          }"
          :ref="
            (el) => {
              tabsElements[tabIdx] = el as HTMLButtonElement;
            }
          "
          type="button"
          @click="onChangeTab(tabIdx)"
        >
          {{ tab.title }}
        </button>
      </li>
    </ul>

    <ul class="market-watch__content" ref="tabContent">
      <li
        v-for="(tabContentItem, tabContentIdx) in tabs[currentTabIndex].data"
        :key="`tab-content-${tabContentItem.ticker}-${tabContentIdx}`"
        class="market-watch__content-item"
      >
        <div class="market-watch__ticker-wrapper">
          <img
            class="market-watch__ticker-icon"
            :src="`/icons/${tabContentItem.type}/${tabContentItem.ticker.toLowerCase()}.svg`"
            :alt="tabContentItem.ticker_with_slash"
            width="30"
            height="30"
          />

          <p class="market-watch__ticker-name">{{ tabContentItem.ticker_with_slash }}</p>
        </div>

        <div class="market-watch__price-info">
          <p class="market-watch__price">{{ tabContentItem.price }} BTC</p>
          <p
            class="market-watch__difference"
            :class="{
              'market-watch__difference_negative': Number(tabContentItem.difference_percentage) < 0,
            }"
          >
            {{ tabContentItem.difference_price }} ({{ tabContentItem.difference_percentage }}%)
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { MarketWatchTab } from "@/services/types/tools.type";

const props = withDefaults(
  defineProps<{
    tabs: MarketWatchTab[];
    activeToolType?: string;
  }>(),
  {
    activeToolType: "crypto",
  }
);

const currentTabIndex = ref<number>(0);
const currentTabWidth = ref<number>(32);
const currentTabWidthString = computed<string>(() => {
  return `${currentTabWidth.value}px`;
});
const currentTabOffsetLeft = ref<number>(0);
const currentTabOffsetLeftString = computed<string>(() => {
  return `${currentTabOffsetLeft.value}px`;
});

const tabsElements = ref<HTMLButtonElement[]>([]);
const tabContent = ref<HTMLUListElement>();

const sortedTabs = computed<MarketWatchTab[]>(() => {
  return props.tabs.sort((tab1, tab2) => {
    if (tab1.slug === props.activeToolType) {
      return -1;
    }

    if (tab2.slug === props.activeToolType) {
      return 1;
    }

    return 0;
  });
});

const onChangeTab = (tabIdx: number) => {
  currentTabIndex.value = tabIdx;
  currentTabWidth.value = tabsElements.value[tabIdx]?.offsetWidth;
  currentTabOffsetLeft.value = tabsElements.value[tabIdx]?.offsetLeft;

  if (tabContent.value) {
    tabContent.value.scrollTop = 0;
  }
};

const setTabPosition = () => onChangeTab(currentTabIndex.value);

onMounted(() => {
  onChangeTab(0);
  window.addEventListener("resize", setTabPosition);
});

onUnmounted(() => {
  window.removeEventListener("resize", setTabPosition);
});
</script>

<style scoped lang="scss">
.market-watch {
  padding: 30px;
  border: 2px solid $color-disable-light;

  @include media-breakpoint-up("xxl") {
    padding-bottom: 23px;
  }
}

.market-watch__title {
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.4;
}

.market-watch__tabs-list {
  position: relative;
  display: flex;
  column-gap: 20px;
  padding: 0;
  margin: 0;
  list-style: none;
  border-bottom: 2px solid $color-disable-light;
}

.market-watch__tabs-list::after {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: v-bind(currentTabWidthString);
  height: 2px;
  content: "";
  background-color: $color-primary-pre-light;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: width, transform;
  transform: translateX(v-bind(currentTabOffsetLeftString));
}

.market-watch__tab {
  display: block;
  padding-bottom: 8px;
  font-size: 9px;
  line-height: 1.3;
  color: $color-primary;

  @include media-breakpoint-up("md") {
    font-size: 12px;
    line-height: 1.4;
  }
}

.market-watch__tab_active {
  font-weight: 600;
  color: $color-text-dark;
}

.market-watch__content {
  max-height: 392px;
  margin: 0;
  margin-top: 30px;
  overflow-y: scroll;
  scrollbar-width: none;

  @include media-breakpoint-up("md") {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    max-height: 196px;
  }

  @include media-breakpoint-up("xl") {
    display: block;
    max-height: 392px;
  }
}

.market-watch__content::-webkit-scrollbar {
  display: none;
}

.market-watch__content-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 49px;
  border-bottom: 1px solid $color-border-light;
}

.market-watch__content-item:first-child {
  border-top: 1px solid $color-border-light;
}

.market-watch__content-item:nth-child(2) {
  @include media-breakpoint-up("md") {
    border-top: 1px solid $color-border-light;
  }

  @include media-breakpoint-up("xl") {
    border-top: 0;
  }
}

.market-watch__ticker-wrapper {
  display: flex;
  column-gap: 8px;
  align-items: center;
}

.market-watch__ticker-icon {
  width: 30px;
  height: 30px;
}

.market-watch__ticker-name {
  font-size: 14px;
  font-weight: 700;
  color: $color-primary-hover;
  letter-spacing: 0.1em;

  @include media-breakpoint-up("md") {
    font-size: 17px;
  }
}

.market-watch__price {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  text-align: right;

  @include media-breakpoint-up("md") {
    font-size: 14px;
  }
}

.market-watch__difference {
  margin: 0;
  margin-top: 2px;
  font-size: 9px;
  line-height: 1.3;
  color: $color-green-light;
  text-align: right;

  @include media-breakpoint-up("md") {
    font-size: 12px;
    font-weight: 500;
  }
}

.market-watch__difference_negative {
  color: $color-danger;
}
</style>
