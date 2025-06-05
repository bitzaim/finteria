<template>
  <NuxtLayout name="top-background">
    <CategoryDetailWrapper />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CategoryDetailWrapper from "@/components/blog/category-detail/CategoryDetailWrapper.vue";

useHead({
  title: "Blog — Finteria",
  meta: [
    {
      name: "description",
      content:
        "Explore the Finteria blog for the latest hot topics in trading. Get insights, updates, news and more from a team of experts at Finteria.",
    },
    {
      name: "keywords",
      content: "trading blog",
    },
  ],
});
</script>
