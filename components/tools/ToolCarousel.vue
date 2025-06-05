<template>
  <div class="tool-carousel">
    <button
      class="tool-carousel__btn tool-carousel__prev"
      ref="prev"
      type="button"
      :title="$t('blog.list.paginatorPrev')"
    />

    <button
      class="tool-carousel__btn tool-carousel__next"
      ref="next"
      type="button"
      :title="$t('blog.list.paginatorNext')"
    />

    <Swiper
      class="swiper tool-carousel__carousel"
      :modules="modules"
      wrapper-tag="ul"
      :slides-per-view="'auto'"
      :navigation="{
        prevEl: prev,
        nextEl: next,
      }"
    >
      <SwiperSlide class="swiper-slide tool-carousel__slide" v-for="tool in items" :key="tool.id" tag="li">
        <ToolCard :data="tool" :type="type" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Tool } from "@/services/types/tools.type";
import ToolCard from "./ToolCard.vue";

import "swiper/css";
import "swiper/css/navigation";

withDefaults(
  defineProps<{
    items: Tool[];
    type?: string;
  }>(),
  {
    type: "crypto",
  }
);

const modules = [Navigation];

const prev = ref(null);
const next = ref(null);
</script>

<style scoped lang="scss">
.tool-carousel {
  position: relative;
  padding-bottom: 50px;

  @include media-breakpoint-up("md") {
    padding-bottom: 70px;
  }

  @include media-breakpoint-up("xxl") {
    padding: 0;
  }
}

.tool-carousel__slide {
  width: 300px;
}

.tool-carousel__slide:not(:last-child) {
  margin-right: 20px;

  @include media-breakpoint-up("lg") {
    margin-right: 30px;
  }
}

.tool-carousel__btn {
  position: absolute;
  bottom: 0;
  width: 30px;
  height: 30px;
  background-color: $color-primary-pre-light;
  background-image: url("data:image/svg+xml,%3Csvg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 11L2 6L7 1' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: 45% 50%;
  background-size: 8px 12px;
  border: 0;
  border-radius: 50%;

  @include media-breakpoint-up("md") {
    width: 40px;
    height: 40px;
    background-size: 10px 16px;
  }

  @include media-breakpoint-up("xxl") {
    bottom: 50%;
    margin-bottom: -20px;
  }
}

.tool-carousel__prev {
  left: 50%;
  margin-left: -40px;

  @include media-breakpoint-up("md") {
    margin-left: -55px;
  }

  @include media-breakpoint-up("xxl") {
    left: -70px;
    margin: 0;
  }
}

.tool-carousel__next {
  right: 50%;
  margin-right: -40px;
  transform: rotate(180deg);

  @include media-breakpoint-up("md") {
    margin-right: -55px;
  }

  @include media-breakpoint-up("xxl") {
    right: -70px;
    margin: 0;
  }
}
</style>
