<template>
  <article class="article-card">
    <h3 class="article-card__title">
      <NuxtLink class="article-card__link" :to="localePath(`/blog/${data.slug}`)">
        {{ data.title }}
      </NuxtLink>
    </h3>

    <ArticleInfo class="article-card__info" :published-at="data.published_at" :categories="data.categories" />

    <img class="article-card__image" :src="data.main_image" :alt="data.title" width="300" height="150" />

    <p v-if="data.preview_text" class="article-card__description">
      {{ data.preview_text }}
    </p>
  </article>
</template>

<script setup lang="ts">
import ArticleInfo from "./ArticleInfo.vue";
import { Article } from "~~/services/types/blog.type";

defineProps<{
  data: Article;
}>();

const localePath = useLocalePath();
</script>

<style scoped lang="scss">
.article-card {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 340px;
  padding: 20px;
  background-color: $color-primary-light-trade;

  @include media-breakpoint-up("lg") {
    width: 630px;
    height: 560px;
  }
}

.article-card__image {
  flex-shrink: 0;
  order: -2;
  width: 300px;
  max-width: 100%;
  height: 150px;
  object-fit: cover;

  @include media-breakpoint-up("sm") {
    height: 18.425vw;
    max-height: 150px;
  }

  @include media-breakpoint-up("lg") {
    width: 590px;
    max-height: 295px;
  }
}

.article-card__info {
  order: -1;
  margin-top: 20px;

  @include media-breakpoint-up("lg") {
    margin-top: 22px;
  }
}

.article-card__title {
  margin: 0;
  margin-top: 23px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("lg") {
    margin-top: 20px;
    font-size: 24px;
  }
}

.article-card__link {
  color: inherit;
}

.article-card__link:before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: "";
}

.article-card__description {
  height: 81px;
  margin: 0;
  margin-top: 10px;
  overflow: hidden;
  font-size: 18px;
  font-weight: 500;
  color: $color-grey;
}
</style>
