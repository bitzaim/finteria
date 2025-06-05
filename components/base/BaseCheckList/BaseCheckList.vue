<template>
  <ul class="check-list">
    <li class="check-list__item" v-for="(item, itemIdx) in items" :key="getHashKeyByTitleAndIndex(item.title, itemIdx)">
      <component :is="titleComponent" class="check-list__title">{{ $t(item.title) }}</component>
      <p class="check-list__text">{{ $t(item.text) }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Props } from "./BaseCheckList.type";
import { getHashKeyByTitleAndIndex } from "@/utils/helpers";

const props = defineProps<Props>();

const titleComponent = computed<string>(() => {
  return props.titleTag ?? "p";
});
</script>

<style scoped lang="scss">
.check-list {
  padding: 0;
  margin: 20px 0;
  list-style: none;

  @include media-breakpoint-up("md") {
    margin: 40px 0;
  }
}

.check-list__item {
  position: relative;
  padding-left: 45px;

  @include media-breakpoint-up("md") {
    padding-left: 60px;
  }
}

.check-list__item::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  content: "";
  background-color: $color-primary-pre-light;
  background-image: url("data:image/svg+xml,%3Csvg width='15' height='12' viewBox='0 0 15 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.6028 1.05807C15.0915 1.54674 15.0915 2.33661 14.6028 2.8255L6.47777 10.9503C6.23401 11.1941 5.91403 11.3168 5.59406 11.3168C5.27408 11.3168 4.9541 11.1941 4.71034 10.9503L0.647919 6.88792C0.159027 6.39926 0.159027 5.60916 0.647919 5.1205C1.13658 4.63161 1.92645 4.63161 2.41534 5.1205L5.59406 8.29921L12.8354 1.05807C13.3241 0.569183 14.114 0.569183 14.6028 1.05807V1.05807Z' fill='%23FAFAFA'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 15px 12px;
  border-radius: 5px;

  @include media-breakpoint-up("md") {
    width: 40px;
    height: 40px;
    background-size: 20px 16px;
  }
}

.check-list__item:not(:last-child) {
  margin-bottom: 20px;

  @include media-breakpoint-up("md") {
    margin-bottom: 30px;
  }
}

.check-list__title {
  max-width: 567px;
  padding-top: 3px;
  margin: 0;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}

.check-list__text {
  max-width: 567px;
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 14px;
    line-height: 1.45;
  }
}
</style>
