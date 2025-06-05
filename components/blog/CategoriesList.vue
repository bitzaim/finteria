<template>
  <div class="categories-list">
    <b class="categories-list__title">
      <slot />
    </b>

    <ul class="categories-list__list">
      <li v-for="category in items" :key="category.id" class="categories-list__item">
        <NuxtLink :to="localePath(`/blog/${category.slug}`)" class="categories-list__link">
          {{ category.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Category } from "@/services/types/blog.type";

defineProps<{
  items: Category[];
}>();

const localePath = useLocalePath();
</script>

<style scoped lang="scss">
.categories-list {
  padding: 20px 0;
  border-top: 1px solid $color-disable-light;

  @include media-breakpoint-up("md") {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid $color-disable-light;
  }
}

.categories-list__title {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 18px;
    line-height: 1.45;
  }
}

.categories-list__list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 20px;
  padding: 0;
  margin: 0;
  margin-top: 10px;

  @include media-breakpoint-up("md") {
    column-gap: 40px;
    margin-top: 0;
    margin-left: 40px;
  }
}

.categories-list__link {
  display: block;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 18px;
    line-height: 1.45;
  }
}
</style>
