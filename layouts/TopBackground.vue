<template>
  <div class="top-background">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.top-background {
  @include media-breakpoint-up("md") {
    background-image: url("/img/common/top-bg.png");
    background-repeat: no-repeat;
    background-position: top center;
    background-size: 100%;

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/common/top-bg@2x.png");
    }
  }
}

.webp .top-background {
  @include media-breakpoint-up("md") {
    background-image: url("/img/common/webp/top-bg.webp");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/common/webp/top-bg@2x.webp");
    }
  }
}

.avif .top-background {
  @include media-breakpoint-up("md") {
    background-image: url("/img/common/avif/top-bg.avif");

    @include media-resolution("min", 2dppx) {
      background-image: url("/img/common/avif/top-bg@2x.avif");
    }
  }
}
</style>
