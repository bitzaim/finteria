<template>
  <div class="paginator">
    <a
      v-if="isFirstPage"
      class="paginator__button paginator__prev paginator__button_disabled"
      :title="$t('blog.list.paginatorPrev')"
    />

    <NuxtLink
      v-else
      class="paginator__button paginator__prev"
      :to="{ query: { page: currentPage - 1 } }"
      :title="$t('blog.list.paginatorPrev')"
    />

    <ul class="paginator__list">
      <li
        class="paginator__list-item"
        :class="{
          'paginator__list-item_current': currentPage === 1,
        }"
      >
        <a v-if="currentPage === 1" class="paginator__page paginator__page_current"> 1 </a>

        <NuxtLink v-else class="paginator__page" :to="{ query: { page: 1 } }"> 1 </NuxtLink>
      </li>

      <li v-if="!canShowAllPages && hasDifferenceBetweenFirstPage" class="paginator__list-item">
        <a class="paginator__page"> ... </a>
      </li>

      <li
        class="paginator__list-item"
        :class="{
          'paginator__list-item_current': currentPage === page,
        }"
        v-for="page in currentPageRange"
        :key="`pg-${page}`"
      >
        <a v-if="currentPage === page" class="paginator__page paginator__page_current">
          {{ page }}
        </a>

        <NuxtLink v-else class="paginator__page" :to="{ query: { page: page } }">
          {{ page }}
        </NuxtLink>
      </li>

      <li v-if="!canShowAllPages && hasDifferenceBetweenLastPage" class="paginator__list-item">
        <a class="paginator__page"> ... </a>
      </li>

      <li
        v-if="maxPage > 1"
        class="paginator__list-item"
        :class="{
          'paginator__list-item_current': currentPage === maxPage,
        }"
      >
        <a v-if="currentPage === maxPage" class="paginator__page paginator__page_current">
          {{ maxPage }}
        </a>

        <NuxtLink v-else class="paginator__page" :to="{ query: { page: maxPage } }">
          {{ maxPage }}
        </NuxtLink>
      </li>
    </ul>

    <a
      v-if="isLastPage"
      class="paginator__button paginator__next paginator__button_disabled"
      :title="$t('blog.list.paginatorNext')"
    />

    <NuxtLink
      v-else
      class="paginator__button paginator__next"
      :to="{ query: { page: currentPage + 1 } }"
      :title="$t('blog.list.paginatorNext')"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  maxPage: number;
}>();

const route = useRoute();

const DIFFERENCE_SHOW_PAGES = 2;

const currentPage = computed<number>(() => {
  return Number(route.query.page) || 1;
});

const isFirstPage = computed<boolean>(() => {
  return currentPage.value === 1;
});

const isLastPage = computed<boolean>(() => {
  return currentPage.value === props.maxPage;
});

const currentPageRange = computed<number[]>(() => {
  const diffMaxPageAndFirst = props.maxPage - 1;

  if (diffMaxPageAndFirst <= 1) {
    return [];
  } else if (diffMaxPageAndFirst === 2) {
    return [diffMaxPageAndFirst];
  }

  const isFirstOrSecondPage = currentPage.value === 1 || currentPage.value - 1 === 1;
  const isLastOrPrelastPage = currentPage.value === props.maxPage || props.maxPage - currentPage.value === 1;

  if (isFirstOrSecondPage) {
    return [2, 3];
  } else if (isLastOrPrelastPage) {
    return [props.maxPage - 2, diffMaxPageAndFirst];
  }

  return [currentPage.value - 1, currentPage.value, currentPage.value + 1];
});

const canShowAllPages = computed<boolean>(() => {
  return props.maxPage <= DIFFERENCE_SHOW_PAGES + 2;
});

const hasDifferenceBetweenFirstPage = computed<boolean>(() => {
  return currentPage.value - 1 > DIFFERENCE_SHOW_PAGES;
});

const hasDifferenceBetweenLastPage = computed<boolean>(() => {
  return props.maxPage - currentPage.value > DIFFERENCE_SHOW_PAGES;
});
</script>

<style scoped lang="scss">
.paginator {
  display: flex;
  max-width: 100%;
  height: 35px;

  @include media-breakpoint-up("sm") {
    height: 40px;
  }
}

.paginator__button {
  position: relative;
  width: 35px;
  height: 100%;
  background-color: $color-primary-light-trade;
  border-top: 1px solid $color-disable-light;
  border-bottom: 1px solid $color-disable-light;

  @include media-breakpoint-up("sm") {
    width: 40px;
  }
}

.paginator__button::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 11L2 6L7 1' stroke='%234785EF' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 8px 12px;
}

.paginator__button_disabled {
  cursor: not-allowed;
}

.paginator__prev {
  border-left: 1px solid $color-disable-light;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.paginator__next {
  border-right: 1px solid $color-disable-light;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.paginator__next::before {
  transform: rotate(180deg);
}

.paginator__list {
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
}

.paginator__list-item {
  border-top: 1px solid $color-disable-light;
  border-right: 1px solid $color-disable-light;
  border-bottom: 1px solid $color-disable-light;
}

.paginator__list-item:first-child {
  border-left: 1px solid $color-disable-light;
}

.paginator__page {
  display: inline-block;
  width: 35px;
  height: 100%;
  font-size: 12px;
  font-weight: 700;
  line-height: 33px;
  color: $color-primary;
  text-align: center;

  @include media-breakpoint-up("sm") {
    width: 40px;
    line-height: 38px;
  }

  @include media-breakpoint-up("md") {
    font-size: 14px;
  }
}

.paginator__list-item_current {
  border-top-color: $color-primary-pre-light;
  border-bottom-color: $color-primary-pre-light;
}

.paginator__page_current {
  color: $color-white;
  background-color: $color-primary-pre-light;
}
</style>
