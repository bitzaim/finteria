<template>
  <div>
    <div class="auth">
      <picture class="block__background">
        <source srcset="/img/landings/trade/webp/background.webp" type="image/webp" />
        <img class="block__background-img" src="/img/landings/trade/background.png" alt="background" />
      </picture>
      <h1 class="auth-title">
        <slot name="title" />
      </h1>
      <h2 class="auth-subtitle">
        <slot name="subtitle" />
      </h2>
      <div class="auth-form">
        <div class="auth-content">
          <div class="auth-content-center">
            <slot />
            <div class="auth-content-footer">
              <slot name="footer" />
            </div>
          </div>
          <div class="auth-content-right">
            <slot name="rightSide" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/style/include.scss";
.auth {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 160px;

  @media (max-width: 767px) {
    padding: 40px 10px 47px;
  }

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    content: "";
    background: linear-gradient(180deg, $color-bg-lightest 0%, $color-bg-lightest-to 100%);
  }

  &-title {
    padding-bottom: 30px;
    font-size: 46px;
  }

  &-subtitle {
    padding-bottom: 30px;
    font-size: 24px;
  }

  &-form {
    width: 100%;
    max-width: 850px;
    padding: 60px;
    background-color: $color-white;
    border-top: 3px solid $color-primary-pre-light;

    @media (max-width: 920px) {
      padding: 60px 30px;
    }

    @media (max-width: 767px) {
      padding: 22px 20px 58px;
      background-color: $color-primary-light-trade;
    }
  }

  &-content {
    display: flex;
    @include media-breakpoint-down("md") {
      flex-direction: column;
    }

    &-center {
      display: flex;
      flex-direction: column;
      row-gap: 25px;
      width: 100%;
      max-width: 400px;
      @media (max-width: 920px) {
        max-width: 380px;
      }
      @include media-breakpoint-down("md") {
        row-gap: 20px;
        width: 100%;
        max-width: unset;
      }
    }

    &-right {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 272px;
      padding-left: 30px;
      margin-left: 60px;
      border-left: 1px solid $color-border-pre-dark;
      @media (max-width: 920px) {
        max-width: 240px;
        margin-left: 80px;
      }
      @include media-breakpoint-down("md") {
        width: 100%;
        max-width: unset;
        padding-top: 15px;
        padding-left: 0;
        margin-top: 22px;
        margin-left: 0;
        border-top: 1px solid $color-border-pre-dark;
        border-left: 0;
      }
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include media-breakpoint-down("md") {
        flex-direction: column;
        row-gap: 40px;
        max-width: 300px;
      }
    }
  }
}
</style>
