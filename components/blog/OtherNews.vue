<template>
  <section class="other-news">
    <h2 class="other-news__title">{{ $t("blog.article.otherNews") }}</h2>

    <button
      class="other-news__carousel-btn other-news__prev"
      ref="prev"
      type="button"
      :title="$t('blog.list.paginatorPrev')"
    />

    <button
      class="other-news__carousel-btn other-news__next"
      ref="next"
      type="button"
      :title="$t('blog.list.paginatorNext')"
    />

    <Swiper
      class="swiper other-news__carousel"
      :modules="modules"
      :navigation="{
        prevEl: prev,
        nextEl: next,
      }"
      :slides-per-view="1"
      :breakpoints="{
        '1280': {
          spaceBetween: 30,
          slidesPerView: 2,
        },

        '768': {
          slidesPerView: 2,
          spaceBetween: 15,
        },
      }"
    >
      <SwiperSlide class="other-news__slide" v-for="article in items" :key="article.id">
        <ArticleCard :data="article" />
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Article } from "~~/services/types/blog.type";
import ArticleCard from "./ArticleCard.vue";

import "swiper/css";
import "swiper/css/navigation";

defineProps<{
  items: Article[];
}>();

const modules = [Navigation];

const prev = ref(null);
const next = ref(null);
</script>

<style lang="scss" scoped>
.other-news {
  display: grid;
  grid-template-columns: 1fr 24px 24px;
  column-gap: 16px;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 30px;
  border-top: 1px solid $color-disable-light;

  @include media-breakpoint-up("xxl") {
    position: relative;
    display: block;
    padding-top: 60px;
    padding-bottom: 60px;
  }
}

.other-news__title {
  font-size: 22px;
  font-weight: 500;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 36px;
    text-align: center;
  }
}

.other-news__carousel {
  grid-column: 1 / 4;
  width: 100%;
  margin-top: 30px;

  @include media-breakpoint-up("lg") {
    height: 560px;
    margin-top: 60px;
  }
}

.other-news__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 340px;
  height: 100%;
  font-size: 16px;
  font-weight: bold;

  @include media-breakpoint-up("md") {
    width: 630px;
  }
}

.other-news__carousel-btn {
  width: 24px;
  height: 24px;
  background-color: $color-primary;
  background-image: url("data:image/svg+xml,%3Csvg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 11L2 6L7 1' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: 45% 50%;
  background-size: 8px 12px;
  border: 0;
  border-radius: 50%;

  @include media-breakpoint-up("xxl") {
    position: absolute;
    top: 450px;
    z-index: 2;
    width: 40px;
    height: 40px;
    background-size: 10px 16px;
  }
}

.other-news__prev {
  @include media-breakpoint-up("xxl") {
    left: -70px;
  }
}

.other-news__next {
  transform: rotate(180deg);

  @include media-breakpoint-up("xxl") {
    right: -70px;
  }
}
</style>
