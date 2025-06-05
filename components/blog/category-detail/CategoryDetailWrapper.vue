<template>
  <CategoryDetail
    v-show="(isCategoryRequired && currentCategory) || !isCategoryRequired"
    :category="currentCategory"
    :articles="articles"
    :articles-max-page="articlesMaxPage"
  />
</template>

<script setup lang="ts">
import { getArticlesList } from "@/services/blog";
import { useBlogStore } from "@/stores/blog";
import { Article, ArticleMeta, Category } from "~~/services/types/blog.type";
import CategoryDetail from "./CategoryDetail.vue";

defineProps<{
  isCategoryRequired?: boolean;
}>();

const route = useRoute();
const { locale } = useI18n();

const blogStore = useBlogStore();

if (blogStore.categories?.length === 0) {
  await blogStore.FETCH_CATEGORIES(locale.value);
}

const articles = ref<Article[]>([]);
const articlesMeta = ref<ArticleMeta>({
  current_page: 1,
  last_page: 1,
});

const articlesMaxPage = computed<number>(() => {
  return articlesMeta.value.last_page;
});

const queryPageNumber = computed<number>(() => {
  return route.query.page ? Number(route.query.page) : 1;
});

const currentCategory = computed<Category | undefined>(() => {
  return blogStore.categories?.find((category) => category.slug === route.params.slug);
});

const categories = computed<number[]>(() => {
  return currentCategory.value ? [currentCategory.value.id] : [];
});

const { data: response, error } = await useAsyncData(
  "articles",
  () => getArticlesList({ page: queryPageNumber.value, limit: 6, categories: categories.value, lang: locale.value }),
  {
    watch: [queryPageNumber],
  }
);

watch(locale, () => {
  blogStore.FETCH_CATEGORIES(locale.value);
});

watch(error, () => {
  if (error.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
  }
});

watch(
  response,
  () => {
    if (response.value?.data && response.value?.meta) {
      if (queryPageNumber.value > response.value.meta.last_page) {
        throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
      }

      articles.value = response.value.data;
      articlesMeta.value = response.value.meta;
    }
  },
  { immediate: true }
);
</script>
