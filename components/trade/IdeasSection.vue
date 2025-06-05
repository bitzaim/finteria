<template>
  <section class="ideas container">
    <picture class="block__background">
      <img class="block__background-img" src="/img/landings/trade/bg-ideas.svg" alt="background" />
    </picture>
    <h2 class="title">{{ $t("trade.tradingIdeas.title") }}</h2>
    <p class="subtitle">
      {{ $t("trade.tradingIdeas.subtitle") }}
    </p>
    <div class="ideas__wrap">
      <div class="ideas__card" v-for="(idea, index) in ideasData" :key="`idea${index}`">
        <div class="ideas__card-top">
          <IconArrow class="ideas__card-icon" />
          <p>{{ idea.title }}</p>
        </div>
        <picture>
          <source :srcset="`/img/landings/trade/webp/${idea.img}.webp`" type="image/webp" />
          <img class="ideas__card-img" :src="`/img/landings/trade/${idea.img}.jpg`" alt="background" />
        </picture>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import IconArrow from "@/components/icons/IconArrow.vue";

import { useTradeConstants } from "@/constants/trade";

const { ideasData } = useTradeConstants();
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";
.block__background-img {
  width: fit-content;
  margin-left: auto;
  @include media-breakpoint-down("xl") {
    width: 100%;
  }
}

.ideas {
  position: relative;
  margin-top: 200px;
  margin-bottom: 160px;
}

.ideas__wrap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 60px;
  @include media-breakpoint-down("xl") {
    grid-template-columns: 1fr 1fr;
  }
  @include media-breakpoint-down("sm") {
    grid-template-columns: 1fr;
  }
}

.ideas__card {
  display: grid;
  gap: 20px;
  padding: 20px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  background: $color-primary-lightest;

  transition: background $transition-time, color $transition-time, transform $transition-time;
  &:hover {
    color: $color-white;
    background: $color-primary;
    transform: scale(1.05);
  }
}

.ideas__card-top {
  display: flex;
  gap: 16px;
  align-items: center;
}

.ideas__card-icon {
  width: 30px;
  height: 30px;
  padding: 8px;
  color: $color-white;
  background: $color-orange;
  transform: rotate(-90deg);
}

.ideas__card-img {
  width: 100%;
  height: 100%;
}
</style>
