<template>
  <NuxtLayout name="top-background">
    <section ref="scrollComponent" class="press-media">
      <div class="container">
        <h1 class="title title_without-border">{{ $t("pressMedia.title") }}</h1>

        <ul class="press-media__list">
          <li class="press-media__item" v-for="newsItem in visibleNews" :key="newsItem.id">
            <h3 class="press-media__item-title">{{ newsItem.title }}</h3>

            <div class="press-media__item-picture-wrapper">
              <ClientOnly>
                <picture
                  class="press-media__item-picture"
                  :style="{
                    'background-color': newsItem.backgroundColor,
                  }"
                >
                  <source
                    v-if="typeof newsItem.logo === 'object' && newsItem.logo.webp"
                    :srcset="getWebpSource(newsItem.logo)"
                    type="image/webp"
                  />

                  <source
                    v-if="typeof newsItem.logo === 'object' && newsItem.logo.avif"
                    :srcset="getAvifSource(newsItem.logo)"
                    type="image/avif"
                  />

                  <img
                    class="press-media__item-image"
                    :src="getOriginalSource(newsItem.logo)"
                    :srcset="getOriginalSourceSet(newsItem.logo)"
                    :alt="newsItem.alt"
                    :width="newsItem.width"
                    :height="newsItem.height"
                    loading="lazy"
                  />
                </picture>
              </ClientOnly>
            </div>

            <p v-if="newsItem.date" class="press-media__item-date">
              <time :datetime="newsItem.date">
                {{ formatDateShort(newsItem.date, currentLocale) }}
              </time>
            </p>

            <p class="press-media__item-description">
              {{ newsItem.description }}
            </p>

            <a class="press-media__item-link" :href="newsItem.link" target="_blank" rel="noindex, nofollow">
              Read more
            </a>
          </li>
        </ul>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { News, PRESS_MEDIA_NEWS as news } from "@/constants/pressMedia";
import { getWebpSource, getAvifSource, getOriginalSource } from "@/utils/image";
import { formatDateShort } from "@/utils/date";
import { useDebounceFn } from "@vueuse/core";

const i18n = useI18n();
const currentLocale = computed<string>(() => {
  return i18n.locale.value || "en";
});

useHead({
  title: "Press and media | Finteria",
});

news.sort((item1, item2) => {
  if (item1.date && item2.date) {
    const date1 = new Date(item1.date);
    const date2 = new Date(item2.date);

    if (date1.getTime() < date2.getTime()) {
      return 1;
    }

    if (date1.getTime() > date2.getTime()) {
      return -1;
    }
  }

  return 0;
});

const NEWS_LIMIT: number = 9;

const scrollComponent = ref<HTMLElement | null>(null);
const visibleNews = ref<News[]>(news.slice(0, NEWS_LIMIT));

onMounted(() => {
  window.addEventListener("scroll", debouncedHandleScroll);
});

onBeforeUnmount(() => {
  window.addEventListener("scroll", debouncedHandleScroll);
});

const loadMoreNews = () => {
  const visibleNewsLength: number = visibleNews.value.length;
  const sliceEnd: number = visibleNewsLength + NEWS_LIMIT;
  const nextNews: News[] = news.slice(visibleNewsLength, sliceEnd);

  visibleNews.value.push(...nextNews);
};

const debouncedHandleScroll = useDebounceFn(() => {
  const element: any = scrollComponent.value;

  if (
    element &&
    element.getBoundingClientRect().bottom < window.innerHeight &&
    news.length !== visibleNews.value.length
  ) {
    loadMoreNews();
  }
}, 10);
</script>

<style scoped lang="scss">
.press-media {
  padding-bottom: 50px;
}

.press-media__list-title {
  margin-top: 48px;
  font-size: 28px;
  text-align: center;

  @include media-breakpoint-up("md") {
    margin-top: 82px;
    text-align: left;
  }
}

.press-media__list {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 50px;
  padding: 0;
  margin: 0;
  margin-top: 32px;
  list-style-type: none;

  @include media-breakpoint-up("md") {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 50px 89px;
    margin-top: 48px;
  }
}

.press-media__item {
  display: grid;
  grid-template-rows: auto auto auto;
  align-content: start;
}

.press-media__item-picture-wrapper {
  order: -1;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.press-media__item-picture {
  display: inline-block;
  padding: 0 10px;
}

.press-media__item-image {
  vertical-align: middle;
}

.press-media__item-title {
  margin-top: 32px;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.45;
  text-align: center;

  @include media-breakpoint-up("md") {
    text-align: left;
  }
}

.press-media__item-date {
  margin: 0;
  margin-top: 32px;
  text-align: center;

  @include media-breakpoint-up("md") {
    text-align: left;
  }
}

.press-media__item-description {
  margin: 0;
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.45;
  text-align: center;

  @include media-breakpoint-up("md") {
    text-align: left;
  }
}

.press-media__item-link {
  position: relative;
  display: inline-block;
  margin-top: 32px;
  text-align: center;

  @include media-breakpoint-up("md") {
    text-align: left;
  }
}

.press-media__item-link::after {
  display: inline-block;
  width: 6px;
  height: 10px;
  margin-left: 5px;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='20' viewBox='0 0 12 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.66602 18.332L9.99935 9.9987L1.66601 1.66536' stroke='%23306acf' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
