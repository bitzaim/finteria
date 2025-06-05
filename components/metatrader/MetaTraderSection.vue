<script setup>
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  paragraph: {
    type: String,
    default: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero exercitationem.",
  },
  featuresLabel: {
    type: String,
    default: "Lorem ipsum dolor",
  },
  features: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <section class="metaTrader">
    <div class="meta_wrap">
      <div class="meta_top">
        <h2 style="margin-bottom: 30px">{{ title }}</h2>
        <p>
          {{ paragraph }}
        </p>
      </div>
      <div class="meta_left">
        <slot name="downloadButtons"></slot>
        <p style="margin: 20px auto">
          {{ featuresLabel }}
        </p>
        <ul>
          <li v-for="feat in features" :key="feat">{{ feat }}</li>
        </ul>
      </div>
      <div class="meta_right">
        <img :src="image" alt="" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.metaTrader {
  position: relative;
  padding-top: 60px;
  padding-bottom: 60px;
  border-bottom: 2px solid $color-disable-light;
  @include media-breakpoint-down("md") {
    padding-top: 30px;
    padding-bottom: 30px;
  }
}

.meta_wrap {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.meta_top {
  grid-column: 1/8;
  margin-bottom: 10px;
  @include media-breakpoint-down("xl") {
    grid-column: 1/13;
  }
  @include media-breakpoint-down("md") {
    h2 {
      font-size: 22px;
    }
  }
}

.meta_left {
  grid-column: 1/8;
  align-self: flex-end;
  justify-self: flex-start;
  @include media-breakpoint-down("md") {
    grid-column: 1/13;
  }
}
.meta_right {
  grid-row: 2;
  grid-column: 8 / 13;
  align-self: flex-end;
  justify-self: flex-end;
  @include media-breakpoint-down("xl") {
    img {
      width: 100%;
      padding-top: 15px;
      padding-left: 15px;
    }
  }
  @include media-breakpoint-down("md") {
    grid-row: unset;
    grid-column: 1/13;
    justify-self: center;
    img {
      max-width: unset !important;
      padding: unset;
    }
  }

  img {
    max-width: 420px;
    margin-top: auto;
  }
}

ul {
  li {
    padding-left: 50px;
    margin: 10px auto;
    background: url("/icons/orange-check.svg") no-repeat left;
    background-size: 20px;
    @include media-breakpoint-down("xl") {
      padding-left: 30px;
      background-position-y: 10%;
    }
    @include media-breakpoint-down("md") {
      padding-left: 20px;
      font-size: 12px;
      background-size: 15px;
    }
  }
}
</style>
