<template>
  <div class="main-page">
    <Head>
      <Title>{{ $t(`trade.meta.title`) }}</Title>
      <Meta name="description" :content="$t(`trade.meta.description`)" />
    </Head>

    <IntroSection :calculator-data="calculatorData" />

    <section class="trade block container">
      <h2 class="title">{{ $t(`trade.tradeAtHome.header`) }}</h2>
      <picture class="block__background">
        <img class="block__background-img" src="/img/landings/trade/bg-lines.svg" alt="background" />
      </picture>
      <div class="trade__wrap">
        <TradeCard v-for="(data, index) in tradeCardData" :data="data" :key="`tradeCard${index}`" />
      </div>
    </section>

    <section class="steps block container">
      <h2 class="title title_center">{{ $t(`trade.threeSteps.title`) }}</h2>
      <div class="step__wrap">
        <div
          class="step"
          :class="{ [`step--${step.icon}`]: true }"
          v-for="(step, index) in tradeCard"
          :key="`step${index}`"
        >
          <h3 class="step__title">{{ $t(step.title) }}</h3>
          <p class="step__text">{{ $t(step.text) }}</p>
        </div>
      </div>
      <NuxtLink
        :to="localePath(path.auth.signUp)"
        id="threeStepsButtonSignup"
        class="button button_yellow button_center"
        no-prefetch
      >
        {{ $t(`trade.threeSteps.button`) }}
      </NuxtLink>
    </section>

    <StrategySection id="copytrading" :top-strategies="topStrategies" />

    <ChoiceSection />

    <AccordionSection section-slug="trade" />

    <div class="join">
      <NuxtLink class="join__button button_center" :to="localePath('/sign-up')" no-prefetch>
        <span class="join__button_text">
          {{ $t(`trade.joinFinteriaNow`) }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TopStrategy } from "@/types/trade.type";
import IntroSection from "@/components/landings/IntroSection.vue";
const TradeCard = defineAsyncComponent(() => import("@/components/trade/TradeCard.vue"));
const StrategySection = defineAsyncComponent(() => import("@/components/trade/StrategySection.vue"));
const ChoiceSection = defineAsyncComponent(() => import("@/components/trade/ChoiceSection.vue"));
const AccordionSection = defineAsyncComponent(() => import("@/components/trade/AccordionSection.vue"));
import { useUserStore } from "@/stores/userStore";
import { useTradeConstants } from "@/constants/trade";
import { path } from "@/constants/routes";
import { getGameCalculator } from "@/services/landings";
import { getTopStrategies } from "@/services/landings";

const { tradeCardData, tradeCard } = useTradeConstants();
const localePath = useLocalePath();
const i18n = useI18n();
const router = useRouter();
const userStore = useUserStore();

const topStrategies = ref<TopStrategy[]>([]);
const calculatorData = ref(null);

onMounted(async () => {
  calculatorData.value = await getGameCalculator();
});

const { data } = await useAsyncData(
  "topStrategies",
  () => {
    return getTopStrategies();
  },
  {
    transform: (data) => {
      console.log(data)
      return {
        ...data,
        results: data.results.map((item) => ({
          ...item,
          performance: Math.round(Number(item.performance) * 100),
        })),
      };
    },
  }
);

topStrategies.value = data.value?.results || [];

const currentLocale = computed<string>(() => {
  return i18n.locale.value || "en";
});

const goToSignUp = () => {
  router.push(localePath("/sign-up"));
};
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";

.block {
  margin-top: 160px;
  margin-bottom: 160px;
  @include media-breakpoint-down("md") {
    margin-top: 40px;
    margin-bottom: 40px;
  }
}
//trade block
.trade {
  position: relative;
}

.trade__wrap {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 60px;
  @include media-breakpoint-down("lg") {
    flex-wrap: wrap;
  }
}

.step__wrap {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 30px;
  margin-top: 80px;
  margin-bottom: 40px;
  @include media-breakpoint-down("lg") {
    grid-template-columns: minmax(200px, 520px);
    justify-content: center;
  }
}

.step {
  display: grid;
  gap: 10px;
  justify-items: center;
  padding: 30px 50px;
  text-align: center;
  background: $color-primary-lightest;
}

.step::before {
  width: 64px;
  height: 64px;
  margin-top: -55px;
  content: "";
  background-repeat: no-repeat;
  background-position: center;
}

.step--flag::before {
  width: 40px;
  height: 46px;
  background-image: url("/img/landings/icons/flag.svg");
}

.step--wallet::before {
  background-image: url("/img/landings/icons/wallet.svg");
}

.step--trade::before {
  background-image: url("/img/landings/icons/trade.svg");
}

.step__title {
  font-size: 24px;
}

.join__button {
  display: block;
  width: 100%;
  height: 100%;
  padding-top: 150px;
  padding-bottom: 150px;
  margin: 0 auto;
  font-size: 36px;
  color: $color-white;
  text-align: center;
  background: $color-primary-pre-light;
  background: url("/img/landings/trade/join.webp");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  @include media-breakpoint-down("lg") {
    padding: 120px 0;
  }
  @include media-breakpoint-down("md") {
    padding: 70px 0;
    font-size: 22px;
  }
}

.join__img {
  position: relative;
  z-index: 2;
  display: block;
  max-width: 95%;
  margin-right: auto;
  margin-bottom: -80px;
  margin-left: auto;
  @include media-breakpoint-down("md") {
    max-width: 70%;
    margin-bottom: 0;
  }
}

.join__button_text {
  border-bottom: 2px solid $color-orange;
}

#threeStepsButtonSignup {
  width: max-content;
  min-width: 122px;
}

.main-page__profit-widget {
  position: fixed;
  bottom: 55px;
  left: 10px;
  z-index: 9;

  @include media-breakpoint-up("xl") {
    bottom: 140px;
  }
}
</style>
