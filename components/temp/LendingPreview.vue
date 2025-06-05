<template>
  <div class="preview" :class="{ 'pb-0': props.paddingBottomNone }">
    <picture class="block__background">
      <source srcset="/img/landings/trade/webp/background.webp" type="image/webp" />
      <img class="block__background-img" src="/img/landings/trade/background.png" alt="background" />
    </picture>
    <div class="container">
      <div class="row justify-content-between">
        <div class="col-lg-6">
          <p v-if="hasSlotContent($slots.pretitle)" class="preview__pre-title">
            <slot name="pretitle" />
          </p>
          <h1 class="intro__title mb-4"><slot name="title" /></h1>
          <h4 class="intro__text mb-4"><slot name="subtitle" /></h4>

          <div class="preview__posttitle">
            <slot name="posttitle" />
          </div>

          <div class="row align-items-center">
            <div class="col-lg-auto d-flex flex-column d-md-block">
              <slot name="btnPrimary" />
            </div>
            <div class="col-lg-auto">
              <div class="second-area">
                <slot name="btnSecond" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <slot name="text" />
        </div>
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { hasSlotContent } from "@/utils/hasSlotContent";

const props = defineProps({
  paddingBottomNone: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.intro__title {
  font-size: 46px;
  @include media-breakpoint-down("md") {
    font-size: 28px;
    text-align: center;
  }
}

.intro__text {
  font-size: 24px;
  @include media-breakpoint-down("md") {
    font-size: 16px;
    text-align: center;
  }
}

.preview {
  position: relative;
  padding-top: 80px;
  padding-bottom: 80px;
  @include media-breakpoint-down("md") {
    padding-top: 30px;
  }
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
  }
  &__posttitle {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    @include media-breakpoint-down("md") {
      font-size: 12px;
      font-weight: 700;
      line-height: 140%;
    }
  }
}
</style>
