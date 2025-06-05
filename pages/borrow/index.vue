<script setup>
import LandingPreview from "@/components/temp/LendingPreview.vue";
import LandingRates from "@/components/landings/LandingRates.vue";
import Container from "@/components/temp/Container.vue";
import SplitedBlock from "@/components/temp/SplitedBlock.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import ListOL from "@/components/temp/ListOl.vue";
import AccordionUi from "@/components/trade/AccordionSection.vue";
import CalculatorBorrrow from "@/components/temp/CalculatorBorrow.vue";
import IntroOption from "@/components/trade/TradeOption.vue";

import { computed } from "vue";
import { useLangStore } from "@/stores/lang";
import IconBitGoEmblem from "~~/components/icons/IconBitGoEmblem.vue";
import { path } from "~~/constants/routes";
definePageMeta({ middleware: ["redirect-to-error-page"] });
const route = useRoute();
const page = computed(() => route?.name);

const langStore = useLangStore();
const i18n = useI18n();
const localePath = useLocalePath();

const getI18nPath = computed(() => i18n.messages.value[langStore.locale][page.value]);
const ol_items = computed(() => [...getI18nPath.value.infoBlock.left_items]);
const ul_items = computed(() => [...getI18nPath.value.infoBlock.right_items]);

const introOptionsData = computed(() => i18n.messages.value[langStore.locale].exchange?.numCards);

const smallItems = computed(() => i18n.messages.value[langStore.locale].exchange?.smallNumCards);
</script>

<template>
  <div>
    <Head>
      <Title>Borrow</Title>
    </Head>
    <LandingPreview>
      <template #title>{{ $t(`${page}.landingPreview.title`) }}</template>
      <template #subtitle>{{ $t(`${page}.landingPreview.subtitle`) }}</template>

      <template #posttitle>
        <div class="intro__advantages-wrap">
          <div class="intro__advantages">
            <IconBitGoEmblem width="42" height="40" class="intro__advantages-icon" />
            <p class="intro__advantages-text">
              {{ $t(`exchange.landingPreview.posttitle`) }}
              <span class="d-block d-md-none"></span>
              {{ $t(`exchange.landingPreview.posttitle2`) }}
            </p>
          </div>

          <div class="intro__advantages">
            <img class="intro__advantages-icon" src="/img/landings/icons/star.svg" alt="icon" />
            <p class="intro__advantages-text">
              {{ $t(`exchange.landingPreview.optionsAdvantages`) }}
              <span class="d-block d-md-none"></span>
              {{ $t(`exchange.landingPreview.optionsAdvantages2`) }}
            </p>
          </div>
        </div>
      </template>

      <template #btnPrimary>
        <NuxtLink :to="localePath(path.account.exchange)" class="button button_yellow">
          {{ $t(`${page}.landingPreview.btnPrimary`) }}
        </NuxtLink>
      </template>

      <template #text>
        <CalculatorBorrrow />
      </template>
    </LandingPreview>

    <LandingRates with-line :title="$t(`${page}.landingRates.title`)" />

    <div class="container" v-if="introOptionsData">
      <div class="block__options">
        <IntroOption v-for="(option, index) in introOptionsData" :key="`options${index}`">
          <template #title>
            {{ option.bigTitle }}
          </template>
          <template #subTitle>
            {{ option.subtitle }}
          </template>
        </IntroOption>
      </div>

      <div class="block__options_small">
        <div v-for="(option, index) in smallItems" class="block__options-items_small" :key="`smallOptions${index}`">
          <img
            :src="`/img/landings/icons/${option.icon}.svg`"
            :alt="option.icon"
            class="block__options-items_small_img"
          />
          {{ option.text }}
        </div>
      </div>
    </div>
    <div class="mt-5 d-lg-none"></div>
    <Container container :padding-top="120">
      <SplitedBlock no-gutters left-col="col-lg-6" right-col="col-lg-5 ms-auto" with-line with-stripes>
        <template #header>{{ $t(`${page}.infoBlock.title`) }}</template>
        <template #left>
          <ListOL :items="ol_items" />
        </template>
        <template #right>
          <CardUi background="#E0F1FF" class="ui-card--info-block">
            <h3>{{ $t(`${page}.infoBlock.right_title`) }}</h3>

            <ul class="mt-4">
              <li v-for="(item, key) in ul_items" :key="key">
                <p>{{ item }}</p>
              </li>
            </ul>
          </CardUi>
        </template>
      </SplitedBlock>
    </Container>
    <AccordionUi section-slug="borrow" />
  </div>
</template>

<style scoped lang="scss">
.block__options {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  @include media-breakpoint-down("xl") {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

.block__options_small {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  margin-top: 40px;
}

.block__options-items_small {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  font-weight: 800;
  color: $color-disable-dark;
  @include media-breakpoint-down("md") {
    width: calc(50% - 20px);
  }
}

.block__options-items_small_img {
  @include media-breakpoint-down("md") {
    width: 24px;
  }
}

.intro__icon {
  height: 40px;
}
.font-700 {
  font-weight: 700;
}

.intro__advantages-wrap {
  display: flex;
  gap: 6px;
  margin-top: 60px;
  margin-bottom: 20px;
  @include media-breakpoint-down("lg") {
    flex-direction: column;
    gap: 16px;
  }
  @include media-breakpoint-down("md") {
    //margin-top: 20px;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 20px auto 20px;
  }
  @include media-breakpoint-down("sm") {
    //flex-direction: column;
    gap: 30px;
  }
}

.intro__advantages {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  &-text {
    //styleName: Text/Default bold;
    max-width: 131px;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0em;
    @include media-breakpoint-down("sm") {
      font-size: 12px;
      line-height: 140%;
      text-align: left;
    }
  }
}

.intro__advantages-icon {
  @include media-breakpoint-down("sm") {
    width: 30px;
  }
}
</style>
