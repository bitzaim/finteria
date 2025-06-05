<template>
  <ul class="article-list">
    <li v-for="article in items" :key="article.id" class="article-list__item">
      <ArticleCard class="article-list__card" :data="article" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import ArticleCard from "./ArticleCard.vue";
import { Article } from "~~/services/types/blog.type";

defineProps<{
  items: Article[];
}>();
</script>

<style scoped lang="scss">
.article-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 30px;
  column-gap: 20px;
  justify-content: center;
  padding: 0;
  margin: 0;

  @include media-breakpoint-up("xl") {
    column-gap: 20px;
    justify-content: space-between;
  }

  @include media-breakpoint-up("xxl") {
    column-gap: 30px;
  }
}

.article-list__item {
  @include media-breakpoint-up("sm") {
    max-width: calc(50% - 20px);
  }
}

.article-list__card {
  max-width: 100%;
}
</style>
