<template>
  <article class="blog-article">
    <div class="container blog-article__container">
      <h1 class="title title_without-border blog-article__title">{{ article.title }}</h1>

      <div class="blog-article__main">
        <img class="blog-article__image" :src="article.main_image" :alt="article.title" width="340" height="170" />

        <ArticleInfo
          class="blog-article__info"
          :published-at="article.published_at"
          :categories="blogStore.categories"
        />

        <div class="blog-article__content" v-html="article.body" />
      </div>

      <aside class="sidebar blog-article__aside">
        <section class="sidebar__categories">
          <h2 class="visually-hidden">{{ $t("blog.list.categories") }}</h2>

          <CategoriesList
            v-if="blogStore.categories && blogStore.categories.length"
            class="blog-article__categories"
            :items="blogStore.categories"
          >
            {{ $t("blog.list.categoriesTitle") }}
          </CategoriesList>
        </section>

        <section v-if="related" class="related sidebar__related">
          <h2 class="sidebar__title">Related articles</h2>

          <ul class="related__list">
            <li class="related__item" v-for="relatedItem in related" :key="relatedItem.id">
              <NuxtLink class="related__link" :to="localePath(`/blog/${relatedItem.slug}`)">
                {{ relatedItem.title }}
              </NuxtLink>
            </li>
          </ul>
        </section>
      </aside>

      <OtherNews v-if="otherNews?.length" class="blog-article__other-news" :items="otherNews" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { Article } from "~~/services/types/blog.type";
import { useBlogStore } from "@/stores/blog";
import ArticleInfo from "@/components/blog/ArticleInfo.vue";
import CategoriesList from "@/components/blog/CategoriesList.vue";

const OtherNews = defineAsyncComponent(() => import("@/components/blog/OtherNews.vue"));

defineProps<{
  article: Article;
  related?: Article[];
  otherNews?: Article[];
}>();

const blogStore = useBlogStore();

const localePath = useLocalePath();
</script>

<style scoped lang="scss">
.blog-article__container {
  @include media-breakpoint-up("lg") {
    display: grid;
    grid-template-columns: 1fr 300px;
    column-gap: 30px;
  }
}

.blog-article__title {
  grid-column: 1 / 3;
  margin-bottom: 20px;

  @include media-breakpoint-up("lg") {
    margin-bottom: 76px;
  }
}

.blog-article__image {
  max-width: 850px;
  object-fit: cover;

  @include media-breakpoint-up("lg") {
    width: 100%;
    height: 425px;
  }
}

.blog-article__info {
  max-width: 850px;
  margin-top: 10px;
}

.blog-article__content {
  margin-top: 30px;

  @include media-breakpoint-up("lg") {
    padding-bottom: 110px;
  }
}

.blog-article__content:deep(h2),
.blog-article__content:deep(h3),
.blog-article__content:deep(p),
.blog-article__content:deep(span),
.blog-article__content:deep(ul) {
  font-weight: 400;
  line-height: 1.4;

  @include media-breakpoint-up("lg") {
    line-height: 1.45;
  }
}

.blog-article__content:deep(h2) {
  margin: 40px 0 30px;
  font-size: 22px;

  @include media-breakpoint-up("lg") {
    margin-top: 60px;
    font-size: 36px;
  }
}

.blog-article__content:deep(h3) {
  margin: 30px 0 20px;
  font-size: 14px;

  @include media-breakpoint-up("lg") {
    margin-top: 40px;
    font-size: 24px;
  }
}

.blog-article__content:deep(p),
.blog-article__content:deep(span) {
  display: block;
  margin: 10px 0;
  font-size: 14px;

  @include media-breakpoint-up("lg") {
    font-size: 18px;
  }
}

.blog-article__content:deep(ul),
.blog-article__content:deep(ol) {
  padding: 0;
  margin: 30px 0;
  font-size: 14px;
  list-style: none;

  @include media-breakpoint-up("lg") {
    font-size: 18px;
  }
}

.blog-article__content:deep(ol) {
  counter-reset: item;
}

.blog-article__content:deep(ul li) {
  position: relative;
  padding-left: 28px;
  line-height: 18px;

  @include media-breakpoint-up("lg") {
    padding-left: 50px;
    line-height: 30px;
  }
}

.blog-article__content:deep(ul li:before) {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 2.06255C18 0.924774 17.0752 0 15.9375 0H2.06255C0.924774 0 0 0.924774 0 2.06255V15.9375C0 17.0752 0.924774 18 2.06255 18H15.9375C17.0752 18 18 17.0752 18 15.9375V2.06255Z' fill='%234785EF'/%3E%3Cpath d='M13.5617 6.0325C13.8549 6.3257 13.8549 6.79962 13.5617 7.09296L8.68666 11.9679C8.54041 12.1141 8.34842 12.1877 8.15643 12.1877C7.96445 12.1877 7.77246 12.1141 7.62621 11.9679L5.18875 9.53041C4.89542 9.23721 4.89542 8.76315 5.18875 8.46996C5.48195 8.17662 5.95587 8.17662 6.24921 8.46996L8.15643 10.3772L12.5013 6.0325C12.7944 5.73917 13.2684 5.73917 13.5617 6.0325V6.0325Z' fill='%23FAFAFA'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  @include media-breakpoint-up("lg") {
    width: 30px;
    height: 30px;
  }
}

.blog-article__content:deep(ul li:not(:last-child)),
.blog-article__content:deep(ol li:not(:last-child)) {
  margin-bottom: 10px;
}

.blog-article__content:deep(ol li) {
  position: relative;
  padding-left: 30px;
  line-height: 24px;
  color: $color-primary;

  @include media-breakpoint-up("lg") {
    padding-left: 46px;
    line-height: 30px;
  }
}

.blog-article__content:deep(ol li:before) {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  color: $color-white;
  text-align: center;
  content: counter(item);
  counter-increment: item;
  background-color: $color-primary;
  border-radius: 50%;

  @include media-breakpoint-up("lg") {
    width: 30px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
  }
}

.blog-article__content:deep(table) {
  width: 100%;
  margin: 30px 0;
}

.blog-article__content:deep(th),
.blog-article__content:deep(td) {
  padding-right: 20px;
  padding-left: 20px;
}

.blog-article__content:deep(th) {
  padding-top: 8px;
  padding-bottom: 12px;
  font-size: 14px;
  font-weight: 400;
  color: $color-grey;
  background-color: $table-header-bg;
}

.blog-article__content:deep(td) {
  padding-top: 18px;
  padding-bottom: 22px;
  font-size: 14px;
  font-weight: 400;
  border-bottom: 1px solid $color-disable-light;
}

.blog-article__aside {
  margin-top: 35px;

  @include media-breakpoint-up("lg") {
    margin-top: 0;
  }
}

.blog-article__categories {
  @include media-breakpoint-up("lg") {
    display: block;
    padding: 25px 0 32px;
  }
}

.blog-article__categories:deep(.categories-list__title) {
  @include media-breakpoint-up("lg") {
    color: $color-primary;
  }
}

.blog-article__categories:deep(.categories-list__list) {
  @include media-breakpoint-up("lg") {
    display: block;
    margin-top: 20px;
    margin-left: 0;
  }
}

.blog-article__categories:deep(.categories-list__item:not(:last-child)) {
  @include media-breakpoint-up("lg") {
    margin-bottom: 20px;
  }
}

.sidebar__related {
  padding-top: 25px;
  padding-bottom: 40px;
  border-top: 1px solid $color-disable-light;
}

.sidebar__title {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;

  @include media-breakpoint-up("lg") {
    font-size: 18px;
    line-height: 1.45;
  }
}

.related__list {
  margin: 0;
  margin-top: 20px;
}

.related__item:not(:last-child) {
  margin-bottom: 20px;
}

.related__link {
  font-size: 12px;
  line-height: 1.4;

  @include media-breakpoint-up("lg") {
    font-size: 14px;
    line-height: 1.45;
  }
}

.blog-article__other-news {
  grid-column: 1 / 3;
}
</style>
