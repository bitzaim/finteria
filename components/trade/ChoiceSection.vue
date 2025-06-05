<template>
  <section class="choice container">
    <h2 class="title title_center">{{ $t("trade.whyFinteria.title") }}</h2>
    <div class="choice__wrap">
      <div class="choice__card" v-for="(card, index) in choiceData" :key="`choice${index}`">
        <img
          class="choice__icon"
          :src="`/img/landings/icons/${card.icon}.svg`"
          width="32"
          height="32"
          :alt="card.icon"
          loading="lazy"
        />
        <p class="choice__text" v-html="$t(`trade.whyFinteria.choices[${index}].text`)" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTradeConstants } from "@/constants/trade";

const { choiceData } = useTradeConstants();
</script>

<style lang="scss">
@import "../assets/style/include.scss";

.choice {
  padding-top: 60px;

  @include media-breakpoint-up("md") {
    padding-top: 160px;
  }

  @include media-breakpoint-up("lg") {
    padding-top: 180px;
  }
}

.choice__wrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 80px 30px;
  margin-top: 70px;
  margin-bottom: 160px;
  @include media-breakpoint-down("lg") {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 40px 20px;
  }
  @include media-breakpoint-up("lg") {
    grid-template-columns: repeat(3, minmax(280px, 1fr));
  }
}

.choice__card {
  display: flex;
  gap: 20px;
}

.choice__icon {
  width: 32px;
  height: 32px;
}

.choice__text {
  font-size: 24px;
  & span {
    font-weight: 700;
    color: $color-primary;
  }
}
</style>
