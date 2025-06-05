<template>
  <ArticleDetail v-if="article" :article="article" :related="related" :other-news="otherNewsResponse?.data" />
</template>

<script setup lang="ts">
import { getArticle, getArticlesList } from "@/services/blog";
import { useBlogStore } from "@/stores/blog";
import { Article } from "~~/services/types/blog.type";
import ArticleDetail from "./ArticleDetail.vue";

const config = useRuntimeConfig();
const route = useRoute();
const { locale } = useI18n();
const blogStore = useBlogStore();

if (blogStore.categories?.length === 0) {
  await blogStore.FETCH_CATEGORIES(locale.value);
}

const articleSlug = String(route.params.slug);
const { data: article } = await useAsyncData("article", () => {
  return getArticle(articleSlug, locale.value);
});

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

const metaURL = computed<string>(() => {
  return `${config.public.META_HOST_URL}${route.fullPath}`;
});

useHead({
  title: article.value?.title,
  meta: [
    {
      name: "description",
      content: article.value?.preview_text,
    },
    {
      name: "og:url",
      content: metaURL,
    },
    {
      name: "og:title",
      content: article.value?.title,
    },
    {
      name: "og:description",
      content: article.value?.preview_text,
    },
    {
      name: "og:type",
      content: "article",
    },
    {
      name: "og:image",
      content: article.value?.main_image,
    },
    {
      name: "twitter:url",
      content: metaURL,
    },
    {
      name: "twitter:title",
      content: article.value?.title,
    },
    {
      name: "twitter:description",
      content: article.value?.preview_text,
    },
    {
      name: "twitter:image",
      content: article.value?.main_image,
    },
  ],
});

const categoriesIds = computed<number[]>(() => {
  if (blogStore.categories?.length) {
    return blogStore.categories.map((category) => category.id);
  }

  return [];
});

const articleCategoriesIds = computed<number[]>(() => {
  if (article.value?.categories.length) {
    return article.value?.categories.map((category) => category.id);
  }

  return [];
});

const otherCategories = computed<number[]>(() => {
  return categoriesIds.value.filter((category) => {
    return !articleCategoriesIds.value.includes(category);
  });
});

const { data: otherNewsResponse } = useLazyAsyncData("otherNews", () => {
  return getArticlesList({ page: 1, limit: 6, categories: otherCategories.value, lang: locale.value });
});

const { data: relatedResponse } = useAsyncData("related", () => {
  return getArticlesList({ page: 1, limit: 6, categories: articleCategoriesIds.value, lang: locale.value });
});

const related = computed<Article[]>(() => {
  return (
    relatedResponse.value?.data.filter((article: Article) => {
      return article.slug !== articleSlug;
    }) || []
  );
});

watch(locale, () => {
  blogStore.FETCH_CATEGORIES(locale.value);
});
</script>
