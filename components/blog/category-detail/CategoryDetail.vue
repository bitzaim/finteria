<template>
  <section class="blog">
    <div class="container">
      <h1 class="title title_without-border">{{ category ? category.name : $t("blog.list.title") }}</h1>

      <p class="blog__lead">
        {{ category ? category.description : $t("blog.list.lead") }}
      </p>

      <CategoriesList
        v-if="blogStore.categories && blogStore.categories.length"
        class="blog__categories"
        :items="categoriesExceptCurrent"
      >
        {{ $t("blog.list.categoriesTitle") }}
      </CategoriesList>

      <section class="articles blog__articles">
        <h2 class="visually-hidden">{{ $t("blog.list.articlesTitle") }}</h2>

        <ArticleList :items="articles" />

        <ArticlePaginator v-show="articles.length" class="articles__paginator" :max-page="articlesMaxPage" />
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useBlogStore } from "@/stores/blog";
import { Article, Category } from "@/services/types/blog.type";
import CategoriesList from "@/components/blog/CategoriesList.vue";
import ArticleList from "@/components/blog/ArticleList.vue";
import ArticlePaginator from "@/components/blog/ArticlePaginator.vue";

const props = defineProps<{
  category?: Category;
  articles: Article[];
  articlesMaxPage: number;
}>();

const blogStore = useBlogStore();

const categoriesExceptCurrent = computed<Category[]>(() => {
  if (props.category?.slug && blogStore.categories?.length) {
    return blogStore.categories.filter((category) => category.slug !== props.category?.slug);
  }

  return blogStore.categories || [];
});
</script>

<style scoped lang="scss">
.blog__lead {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 18px;
    line-height: 1.45;
  }
}

.blog__categories {
  margin-top: 20px;
}

.blog__articles {
  margin-top: 10px;
  margin-bottom: 100px;

  @include media-breakpoint-up("md") {
    margin-top: 60px;
    margin-bottom: 160px;
  }
}

.articles__paginator {
  max-width: 340px;
  margin: 30px auto 0;

  @include media-breakpoint-up("md") {
    max-width: 630px;
    margin-top: 40px;
  }

  @include media-breakpoint-up("xl") {
    margin-right: 0;
    margin-left: 0;
  }
}
</style>
