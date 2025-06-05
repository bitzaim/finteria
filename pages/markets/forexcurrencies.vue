<template>
  <NuxtLayout class="cryptocurrency" name="top-background">
    <section class="intro">
      <div class="container">
        <h1 class="title title_without-border">{{ $t("forex.title") }}</h1>

        <p class="intro__lead">{{ $t("forex.lead") }}</p>
        <p>{{ $t("forex.description1") }}</p>
        <p>{{ $t("forex.description2") }}</p>
      </div>
    </section>

    <section class="tools">
      <div class="container tools__container">
        <h2 class="visually-hidden">{{ $t("forex.toolsSectionTitle") }}</h2>

        <ToolCarousel :items="toolsData" type="forex" />
      </div>
    </section>

    <section class="trading">
      <div class="container">
        <h2 class="title title_border-after">{{ $t("forex.tradingSectionTitle") }}</h2>

        <p class="trading__text">{{ $t("forex.tradingSectionText") }}</p>

        <div class="trading__info">
          <picture>
            <source srcset="/img/tools/webp/trading.webp, /img/tools/webp/trading@2x.webp 2x" type="image/webp" />
            <source srcset="/img/tools/avif/trading.avif, /img/tools/avif/trading@2x.avif 2x" type="image/avif" />
            <img
              class="trading__info-image"
              src="/img/tools/trading.jpg"
              srcset="/img/tools/trading@2x.jpg 2x"
              :alt="$t('forex.tradingSectionTitle')"
              width="340"
              height="300"
            />
          </picture>

          <BaseCheckList class="trading-info__check-list" :items="tradingListItems" />
        </div>
      </div>
    </section>

    <section class="why-finteria">
      <div class="container why-finteria__container">
        <div class="why-finteria__info">
          <h2 class="title title_border-after">{{ $t("forex.whyFinteriaSectionTitle") }}</h2>

          <BaseCheckList class="why-finteria__check-list" :items="whyFinteriaCheckList" />

          <NuxtLink class="button button_yellow cryptocurrency__get-started why-finteria__get-started" to="/">
            {{ $t("forex.getStarted") }}
          </NuxtLink>
        </div>

        <ToolsTable class="why-finteria__tools-table" :items="toolsData" type="forex" />
      </div>
    </section>

    <section class="steps">
      <div class="container">
        <h2 class="title title_center">{{ $t(`trade.threeSteps.title`) }}</h2>

        <BaseStepList class="steps__list" :items="stepList" />

        <NuxtLink
          class="button button_yellow cryptocurrency__get-started steps__get-started"
          :to="localePath('/sign-up')"
        >
          {{ $t("trade.threeSteps.button") }}
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import ToolCarousel from "@/components/tools/ToolCarousel.vue";
import ToolsTable from "@/components/tools/ToolsTable.vue";
import BaseCheckList from "@/components/base/BaseCheckList/BaseCheckList.vue";
import BaseStepList from "@/components/base/BaseStepList/BaseStepList.vue";
import { useToolsData } from "@/composition/useToolsData";
import {
  CRYPTO_TRADING_LIST_ITEMS as tradingListItems,
  CRYPTO_WHY_FINTERIA_CHECKLIST as whyFinteriaCheckList,
  CRYPTO_STEP_LIST as stepList,
} from "@/constants/tools";

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
  title: t("forex.title"),
  meta: [
    {
      name: "description",
      content: t("forex.lead"),
    },
  ],
});

const { toolsData, getToolsData } = useToolsData();
getToolsData("forex");
</script>

<style scoped lang="scss">
.intro__lead {
  margin: 40px 0 30px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}

.tools {
  margin-top: 102px;

  @include media-breakpoint-up("md") {
    margin-top: 120px;
  }

  @include media-breakpoint-up("xl") {
    margin-top: 80px;
  }
}

.tools__container {
  max-width: calc(100% - 15px);
  padding: 0;
  margin-right: 0;

  @include media-breakpoint-up("md") {
    max-width: calc(100% - 40px);
  }

  @include media-breakpoint-up("lg") {
    max-width: 1370px;
    padding: 0 40px;
    margin: 0 auto;
  }
}

.trading {
  margin-top: 60px;

  @include media-breakpoint-up("md") {
    margin-top: 120px;
  }
}

.trading__text {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }
}

.trading__info {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }

  @include media-breakpoint-up("xl") {
    display: flex;
  }
}

.trading__info-image {
  width: 100%;
  height: 300px;
  object-fit: cover;

  @include media-breakpoint-up("xl") {
    max-width: 300px;
    margin-right: 20px;
  }

  @include media-breakpoint-up("xxl") {
    max-width: 324px;
    height: 324px;
    margin-right: 60px;
  }
}

.trading-info__check-list {
  @include media-breakpoint-up("xl") {
    margin: 0;
  }
}

.why-finteria {
  padding: 60px 0;
  margin-top: 60px;
  background-color: $color-disable;

  @include media-breakpoint-up("md") {
    padding: 120px 0;
    margin-top: 120px;
  }
}

.why-finteria__container {
  @include media-breakpoint-up("xxl") {
    display: flex;
    justify-content: space-between;
  }
}

.why-finteria__check-list {
  @include media-breakpoint-between("lg", "xxl") {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 30px;
    column-gap: 20px;
  }
}

.why-finteria__check-list:deep(.check-list__item) {
  @include media-breakpoint-between("lg", "xxl") {
    margin-bottom: 0;
  }
}

.why-finteria__tools-table {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }

  @include media-breakpoint-up("xxl") {
    width: 630px;
    margin: 0;
  }
}

.steps {
  padding: 60px 0;

  @include media-breakpoint-up("md") {
    padding: 120px 0;
  }
}

.steps__list {
  margin-top: 30px;

  @include media-breakpoint-up("md") {
    margin-top: 60px;
  }
}

.cryptocurrency__get-started {
  display: block;
  letter-spacing: 0;
  border-radius: 3px;

  @include media-breakpoint-up("md") {
    width: 194px;
    margin-top: 40px;
  }
}

.why-finteria__get-started {
  margin-top: 20px;
}

.steps__get-started {
  margin: 30px auto 0;
}
</style>
