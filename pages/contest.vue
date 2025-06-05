<template>
  <section class="intro">
    <div class="container">
      <h1 class="intro__title">
        {{ $t("contest.intro.title") }}<br />
        <span class="intro__title-accent">
          {{ $t("contest.intro.tradingContest") }}
        </span>
      </h1>

      <p class="intro__prize">
        {{ $t("contest.intro.prize") }}
        <span class="intro__prize-accent">
          {{ $t("contest.intro.prizeNumber") }}
        </span>
      </p>
      <p class="intro__winners">
        {{ $t("contest.intro.winners") }}
      </p>

      <BaseButton class="intro__registration" full-width size="big" link :to="localePath('/sign-up')">
        {{ $t("contest.intro.freeRegistration") }}
      </BaseButton>
    </div>
  </section>

  <section class="leaders">
    <div class="container leaders__container">
      <h2 class="title title_border-after">{{ $t("contest.leaders.title") }}</h2>

      <p class="leaders__text">
        {{ $t("contest.leaders.text") }}
      </p>

      <LeadersTable class="leaders__table" />
    </div>
  </section>

  <section class="questions">
    <div class="container">
      <h2 class="title title_without-border questions__title">{{ $t("contest.questions.title") }}</h2>

      <div class="questions__accordion">
        <AccordionItem v-for="(question, questionIdx) in questions" :key="`q${questionIdx}`" :item="question" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import AccordionItem from "@/components/trade/AccordionItem.vue";

const LeadersTable = defineAsyncComponent(() => import("@/components/contest/LeadersTable.vue"));

useHead({
  title: "Trading Contest",
  meta: [
    {
      name: "description",
      content: "Trading contest with weekly prize fund up to 20000 USD. Automatic participation for all live accounts.",
    },
  ],
});

const { tm } = useI18n();
const localePath = useLocalePath();
const questions = computed(() => tm("contest.questions.accordions") || []);
</script>

<style lang="scss" scoped>
.intro {
  padding: 30px 0;
  background-color: $color-black-contest;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: contain;

  @include media-breakpoint-up("sm") {
    background-position: center;
    background-size: cover;
  }

  @include media-breakpoint-up("md") {
    padding: 80px 0 60px;
  }

  @include media-breakpoint-up("lg") {
    padding-bottom: 100px;
    background-position: top center;
  }
}

.intro,
.page__body:not(.avif) .intro {
  background-image: url("/img/contest/intro.webp");

  @include media-resolution("min", 2dppx) {
    background-image: url("/img/contest/intro@2x.webp");
  }

  @include media-breakpoint-up("md") {
    background-image: url("/img/contest/intro-768.webp");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/contest/intro-768@2x.webp");
    }
  }

  @include media-breakpoint-up("lg") {
    background-image: url("/img/contest/intro-1024.webp");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/contest/intro-1024@2x.webp");
    }
  }

  @include media-breakpoint-up("xxl") {
    background-image: url("/img/contest/intro-1920.webp");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/contest/intro-1920@2x.webp");
    }
  }
}

.page__body:not(.webp) .intro {
  background-image: url("/img/contest/intro.png");

  @include media-resolution("min", 2dppx) {
    background-image: url("/img/contest/intro@2x.png");
  }

  @include media-breakpoint-up("md") {
    background-image: url("/img/contest/intro-768.png");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/contest/intro-768@2x.png");
    }
  }

  @include media-breakpoint-up("lg") {
    background-image: url("/img/contest/intro-1024.png");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/contest/intro-1024@2x.png");
    }
  }

  @include media-breakpoint-up("xxl") {
    background-image: url("/img/contest/intro-1920.png");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/contest/intro-1920@2x.png");
    }
  }
}

.intro__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: $color-white;
  text-align: center;

  @include media-breakpoint-up("md") {
    font-size: 18px;
    line-height: 1.45;
    text-align: left;
  }
}

.intro__title-accent {
  font-size: 22px;
  color: $color-primary-lightest-secondary;

  @include media-breakpoint-up("md") {
    font-size: 36px;
  }
}

.intro__prize {
  max-width: 310px;
  margin: 247px auto 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  color: $color-white;
  text-align: center;

  @include media-breakpoint-up("md") {
    max-width: 425px;
    margin: 30px 0 0;
    font-size: 46px;
    line-height: 1.4;
    text-align: left;
  }

  @include media-breakpoint-up("lg") {
    max-width: none;
  }
}

.intro__prize-accent {
  color: $color-orange;
}

.intro__winners {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: $color-white;

  @include media-breakpoint-up("md") {
    justify-content: flex-start;
    margin-top: 2px;
    font-size: 18px;
    font-weight: 500;
    line-height: 145%;
  }
}

.intro__winners::before {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 2.86198C1 2.49379 1.29848 2.19531 1.66667 2.19531H18.3333C18.7015 2.19531 19 2.49379 19 2.86198V4.85022C19 6.46473 17.7963 7.80841 16.2321 7.98649V8.29421C16.2321 11.0697 14.4563 13.469 11.9762 14.3179V16.6317H14.189C14.5572 16.6317 14.8557 16.9302 14.8557 17.2984C14.8557 17.6665 14.5572 17.965 14.189 17.965H5.81101C5.44282 17.965 5.14435 17.6665 5.14435 17.2984C5.14435 16.9302 5.44282 16.6317 5.81101 16.6317H8.02381V14.3175C5.54822 13.4697 3.76786 11.0762 3.76786 8.29421V7.98649C2.20366 7.80841 1 6.46473 1 4.85022V2.86198ZM3.76786 6.63729V3.52865H2.33333V4.85022C2.33333 5.74021 2.95506 6.47036 3.76786 6.63729ZM5.10119 3.52865V8.29421C5.10119 11.0651 7.31667 13.3122 10 13.3122C12.6906 13.3122 14.8988 11.0578 14.8988 8.29421V3.52865H5.10119ZM16.2321 3.52865V6.63729C17.0449 6.47037 17.6667 5.74021 17.6667 4.85022V3.52865H16.2321ZM9.35714 14.6119V16.6317H10.6429V14.612C10.4316 14.6341 10.2171 14.6455 10 14.6455C9.78291 14.6455 9.56845 14.6341 9.35714 14.6119ZM10.8333 5.80314C11.2015 5.80314 11.5 6.10162 11.5 6.46981V9.16212C11.5 9.53031 11.2015 9.82878 10.8333 9.82878C10.4651 9.82878 10.1667 9.53031 10.1667 9.16212V6.46981C10.1667 6.10162 10.4651 5.80314 10.8333 5.80314ZM8.92361 6.95699C9.2918 6.95699 9.59028 7.25547 9.59028 7.62366V9.16212C9.59028 9.53031 9.2918 9.82878 8.92361 9.82878C8.55542 9.82878 8.25695 9.53031 8.25695 9.16212V7.62366C8.25695 7.25547 8.55542 6.95699 8.92361 6.95699Z' fill='white'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 2.86198C1 2.49379 1.29848 2.19531 1.66667 2.19531H18.3333C18.7015 2.19531 19 2.49379 19 2.86198V4.85022C19 6.46473 17.7963 7.80841 16.2321 7.98649V8.29421C16.2321 11.0697 14.4563 13.469 11.9762 14.3179V16.6317H14.189C14.5572 16.6317 14.8557 16.9302 14.8557 17.2984C14.8557 17.6665 14.5572 17.965 14.189 17.965H5.81101C5.44282 17.965 5.14435 17.6665 5.14435 17.2984C5.14435 16.9302 5.44282 16.6317 5.81101 16.6317H8.02381V14.3175C5.54822 13.4697 3.76786 11.0762 3.76786 8.29421V7.98649C2.20366 7.80841 1 6.46473 1 4.85022V2.86198ZM3.76786 6.63729V3.52865H2.33333V4.85022C2.33333 5.74021 2.95506 6.47036 3.76786 6.63729ZM5.10119 3.52865V8.29421C5.10119 11.0651 7.31667 13.3122 10 13.3122C12.6906 13.3122 14.8988 11.0578 14.8988 8.29421V3.52865H5.10119ZM16.2321 3.52865V6.63729C17.0449 6.47037 17.6667 5.74021 17.6667 4.85022V3.52865H16.2321ZM9.35714 14.6119V16.6317H10.6429V14.612C10.4316 14.6341 10.2171 14.6455 10 14.6455C9.78291 14.6455 9.56845 14.6341 9.35714 14.6119ZM10.8333 5.80314C11.2015 5.80314 11.5 6.10162 11.5 6.46981V9.16212C11.5 9.53031 11.2015 9.82878 10.8333 9.82878C10.4651 9.82878 10.1667 9.53031 10.1667 9.16212V6.46981C10.1667 6.10162 10.4651 5.80314 10.8333 5.80314ZM8.92361 6.95699C9.2918 6.95699 9.59028 7.25547 9.59028 7.62366V9.16212C9.59028 9.53031 9.2918 9.82878 8.92361 9.82878C8.55542 9.82878 8.25695 9.53031 8.25695 9.16212V7.62366C8.25695 7.25547 8.55542 6.95699 8.92361 6.95699Z' fill='url(%23paint0_linear_6460_41933)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_6460_41933' x1='19' y1='4.24539' x2='2.92835' y2='19.1045' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23D4AB17'/%3E%3Cstop offset='1' stop-color='%23FFE273'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  @include media-breakpoint-up("md") {
    width: 30px;
    height: 30px;
  }
}

.intro__registration {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    width: auto;
    margin-top: 32px;
    text-transform: none;
  }
}

.leaders {
  margin-top: 40px;

  @include media-breakpoint-up("md") {
    margin-top: 80px;
  }
}

.leaders__text {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
    font-size: 24px;
  }
}

.leaders__table {
  margin-top: 40px;

  @include media-breakpoint-up("md") {
    margin-top: 46px;
  }

  @include media-breakpoint-up("xl") {
    margin-top: 90px;
  }
}

.questions {
  margin-bottom: 40px;

  @include media-breakpoint-up("md") {
    margin-bottom: 160px;
  }
}

.questions__title {
  font-size: 22px;
  font-weight: 500;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 36px;
  }
}

.questions__accordion {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }
}

:deep(.accordion__item) {
  border: none;

  @include media-breakpoint-up("md") {
    padding-top: 15px;
    padding-bottom: 15px;
  }
}

:deep(.accordion__btn) {
  gap: 10px;
  align-items: flex-start;

  @include media-breakpoint-up("md") {
    gap: 20px;
    align-items: center;
  }
}

:deep(.accordion__icon-wrap) {
  width: 20px;
  height: 20px;
  padding: 4px;
  background-color: $color-primary-pre-light;

  @include media-breakpoint-up("md") {
    width: 30px;
    height: 30px;
  }
}

:deep(.accordion__btn_active .accordion__icon-wrap) {
  background-color: $color-primary-pre-light;
}

:deep(.accordion__item-drop) {
  margin-top: 10px;
  margin-left: 30px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    margin-top: 18px;
    margin-left: 50px;
    font-size: 18px;
    line-height: 1.45;
  }
}
</style>
