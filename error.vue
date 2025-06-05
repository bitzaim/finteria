<template>
  <div class="wrap">
    <Header />
    <NuxtLoadingIndicator />

    <div>
      <div class="page404">
        <div class="container">
          <h1 class="page404__title">{{ error.statusMessage }}</h1>

          <div class="row">
            <div class="col-lg-8 m-auto">
              <div class="page404-content">
                <h4 class="text-center">Error {{ error.statusCode }}</h4>

                <div class="row">
                  <div class="col-auto m-auto">
                    <IconError503 v-if="error.statusCode === 503" class="mt-4" />
                    <IconErrorPage v-else width="241" height="153" />
                  </div>
                </div>

                <div class="text-center mt-5">
                  <NuxtLink class="page404-content__link" to="/">{{ $t("common.errors.goHomePage") }}</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Header from "@/layouts/Header.vue";
import Footer from "@/layouts/Footer.vue";

import IconErrorPage from "@/components/icons/IconErrorPage.vue";
import IconError503 from "./components/icons/IconError503.vue";

defineProps({
  error: Object,
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
.page404 {
  position: relative;
  padding: 60px 0;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    content: "";
    background: linear-gradient(360deg, $color-white 0%, transparent 21.63%),
      linear-gradient(180deg, $color-white 0%, transparent 24.03%), url("/img/landings/trade/webp/background.webp");
    background-blend-mode: normal, normal, color-burn, overlay, normal;
    @include media-breakpoint-down("md") {
      background-repeat: no-repeat;
      background-position: 50% 30%;
      background-size: 230%;
    }
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
}
.page404__title {
  margin-bottom: 30px;
  text-align: center;
}
.page404-content {
  padding: 60px 0;
  background-color: $color-white;
  border-top: 3px solid $color-primary-pre-light;
}
.page404-content__img {
  margin-top: 37px;
  margin-bottom: 50px;
}
.page404-content__link {
  font-size: 15px;
  font-weight: 400;
  line-height: 145%;
  color: $color-primary;
  text-align: center;
}
</style>
