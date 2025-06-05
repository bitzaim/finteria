<template>
  <div class="trade__card">
    <div class="card__top">
      <picture class="card__top-picture">
        <source :srcset="`/img/landings/trade/webp/${data.logo}.webp`" type="image/webp" />
        <img
          class="intro__background-img"
          :src="`/img/landings/trade/${data.logo}.png`"
          width="55"
          height="53"
          alt="background"
        />
      </picture>
      <h3 class="card__top-title">{{ $t(data.title) }}</h3>
      <p>{{ $t(data.text) }}</p>
    </div>
    <div class="card__content">
      <ul class="trade__options">
        <li v-for="(option, index) in data.options" :key="`tradeCard${index}`" class="trade__option">
          {{ $t(option) }}
        </li>
      </ul>
      <p class="trade__bottom">
        <NuxtLink class="button_small button_yellow" :to="data.link" :target="data?.target">{{
          $t(data.button)
        }}</NuxtLink>
      </p>
    </div>
    <picture class="card__picture">
      <source :srcset="`/img/landings/trade/webp/${data.img}.webp`" type="image/webp" />
      <img
        class="card__img"
        :src="`/img/landings/trade/${data.img}.png`"
        width="305"
        height="160"
        alt="laptop"
        loading="lazy"
      />
    </picture>
  </div>
</template>

<script setup lang="ts">
defineProps<{ data: any }>();
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";

.trade__card {
  // width: fit-content;
  display: grid;
  grid-template-areas:
    "top picture"
    "content picture";
  grid-template-rows: auto;
  grid-template-columns: max-content auto;
  gap: 20px;
  padding: 60px;
  background: $color-primary-lightest;
  &:first-of-type {
    flex-grow: 1;
  }
  &:last-of-type {
    background: $color-primary-light-trade;
  }
  @include media-breakpoint-down("lg") {
    grid-template-areas: "top" "picture" "content";
    grid-template-columns: auto;
    width: 100%;
  }
  @include media-breakpoint-down("md") {
    gap: 10px;
    padding: 30px 20px;
  }
}

.card__top {
  display: grid;
  grid-area: top;
  grid-template-columns: max-content 1fr;
  column-gap: 30px;
  align-items: center;
  width: fit-content;
  margin-bottom: 20px;
}

.card__content {
  grid-area: content;
}

.card__picture {
  display: flex;
  grid-area: picture;
  align-items: center;
  max-width: 600px;

  & img {
    width: 100%;
    height: auto;
  }
}

.card__top-title {
  font-size: 36px;
  font-weight: 500;
  @include media-breakpoint-down("md") {
    font-size: 22px;
  }
}

.card__top-picture {
  display: flex;
  grid-row: 1/3;
  width: fit-content;
  padding: 9px;
  background: $color-primary;
  border-radius: 18px;
}

.card__img {
  max-width: 100%;
  height: 100%;
  @include media-breakpoint-down("lg") {
    display: inline-block;
    margin: auto;
  }
}

.trade__options {
  display: grid;
  gap: 10px;
  margin-bottom: 30px;
  font-weight: 700;
}

.trade__option {
  display: flex;
  gap: 20px;
  align-items: center;
  text-transform: uppercase;
}

.trade__option::before {
  width: 18px;
  height: 18px;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_102_1378)'%3E%3Crect x='2' y='2' width='14' height='14' rx='2' fill='%23FB7C20'/%3E%3Cpath d='M6.5 8.16667L9 10.6667L17.3333 2.33334' stroke='white' stroke-width='1.66667' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_102_1378'%3E%3Crect width='18' height='18' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.trade__bottom {
  margin: 0;
}

.trade__bottom-row {
  margin-top: 10px;
}
</style>
