<template>
  <NuxtLayout name="top-background">
    <CategoryDetailWrapper v-if="pageType === 'CATEGORY'" is-category-required />
    <ArticleDetailWrapper v-else-if="pageType === 'ARTICLE'" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CategoryDetailWrapper from "@/components/blog/category-detail/CategoryDetailWrapper.vue";
import ArticleDetailWrapper from "@/components/blog/article-detail/ArticleDetailWrapper.vue";

const route = useRoute();

const FIXED_CATEGORIES = ["market-research", "education", "reviews"];

const pageType = ref<"CATEGORY" | "ARTICLE" | null>(null);
pageType.value = FIXED_CATEGORIES.includes(String(route.params.slug)) ? "CATEGORY" : "ARTICLE";
</script>
