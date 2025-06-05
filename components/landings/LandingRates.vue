<template>
  <div class="rates" :style="`margin-top: ${props.marginTop}px;`">
    <div class="container">
      <h1 class="title">{{ props.title }}</h1>
      <div class="rates-wrap">
        <div
          class="rates-wrap__item"
          :class="{
            'd-flex align-items-center': !item.percentage,
          }"
          v-for="(item, key) in resetData"
          :key="key"
        >
          <div class="rates-wrap__item-icon">
            <img class="rates-wrap__item-icon-img" :src="`/icons/${toLowerCaseCrypto(item.display_code)}.svg`" />
          </div>
          <div class="rates-wrap__item-sidebar">
            <div class="rates-wrap__item-title">{{ item.name }}</div>
            <div class="rates-wrap__item-number" v-if="item.percentage">{{ Big(item.percentage).times(100) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import toLowerCaseCrypto from "@/utils/utilsLowerCase";
import profile from "@/services/profile";
import Big from "big.js";

const props = defineProps({
  marginTop: {
    type: Number,
    default: 0,
  },
  withLine: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
});

const route = useRoute();
const page = computed(() => route?.name);
const serverRequest = ref();
const resetData = computed(() => serverRequest.value);

const getServeRates = async (val) => {
  try {
    serverRequest.value = await profile.getPageRates('exchange').then((res) => res.data);
  } catch (err) {
    console.error(err)
  }
};

getServeRates(page.value);
</script>

<style lang="scss">
.rates {
  position: relative;
  font-family: "Open Sans", sans-serif;
  font-weight: 500;
  &-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: 60px;
    @include media-breakpoint-down("md") {
      margin-top: 30px;
    }

    &__item {
      display: flex;
      flex-basis: 20%;
      padding-right: 20px;
      margin-bottom: 60px;
      @include media-breakpoint-down("md") {
        display: flex;
        flex-basis: 50%;
        align-items: center;
        margin-bottom: 30px;
      }
      @include media-breakpoint-between("md", "lg") {
        display: flex;
        flex-basis: 25%;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
      }
      &-icon {
        margin-right: 15px;
        @include media-breakpoint-between("md", "lg") {
          margin-right: 0;
        }
      }

      &-sidebar {
        margin-top: 3px;
        color: $color-text-dark;
        @include media-breakpoint-down("md") {
          margin-top: 0;
          font-size: 18px;
          line-height: 24px;
        }
        @include media-breakpoint-between("md", "lg") {
          text-align: center;
        }
      }

      &-title {
        margin-bottom: 5px;
        font-size: 15px;
        font-weight: 700;
        line-height: 145%;
        text-transform: uppercase;
        @include media-breakpoint-down("md") {
          margin-bottom: 0;
        }
        @include media-breakpoint-between("md", "lg") {
          margin-top: 5px;
          margin-bottom: 0;
        }
      }

      &-number {
        font-size: 17px;
        font-weight: 700;
        line-height: 140%;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
    }
  }
}

.rates-wrap__item-icon-img {
  width: 60px;
  height: 60px;
  @include media-breakpoint-down("md") {
    width: 36px;
    height: auto;
  }
}
</style>
