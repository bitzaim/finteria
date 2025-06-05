<template>
  <CardUi in-content>
    <div class="authentication" v-if="!state.showAuthenticator">
      <p class="fw-bold authentication__title">
        {{ $t(`account.settings.authentication.enableAuth`) }}
      </p>
      <p class="authentication__subtitle">
        {{ $t(`account.settings.authentication.enableAuthText`) }}
      </p>
      <hr />
      <BaseButton type="button" mobile-full-width @click="state.showAuthenticator = true">
        {{ $t(`account.settings.authentication.enableAuthBtn`) }}
      </BaseButton>
    </div>

    <div class="authentication" v-else>
      <div class="authentication__item">
        <h4 class="authentication__item-title">
          {{ $t(`account.settings.authentication.download2faApp`) }}
        </h4>
        <p>{{ $t(`account.settings.authentication.download2faAppText`) }}</p>
      </div>
      <div class="authentication__item">
        <h4 class="authentication__item-title">
          {{ $t(`account.settings.authentication.save2faBackupKey`) }}
        </h4>
        <p>{{ $t(`account.settings.authentication.save2faBackupKeyText`) }}</p>

        <div class="row">
          <div class="col-auto">
            <QrCode class="authentication__qr" value="WEUZZD2TJ4HF7DJHFGH9DHFLSHFB" />
          </div>
          <div class="col">
            <p class="fw-bold mb-2">
              {{ $t(`account.settings.authentication.backupSecretKey`) }}
            </p>
            <div class="row">
              <div class="col-lg-8">
                <InputUI placeholder="WEUZZD2TJ4HF7DJHFGH9DHFLSHFB" small class="mb-3" />
              </div>
            </div>
            <p class="color-gray authentication__item-warning">
              {{ $t(`account.settings.authentication.backupSecretKeyText`) }}
            </p>
          </div>
        </div>
      </div>
      <div class="authentication__item">
        <h4 class="authentication__item-title">
          {{ $t(`account.settings.authentication.confirm2faActivation`) }}
        </h4>
        <p class="fw-bold mb-2">
          {{ $t(`account.settings.authentication.confirm2faActivationText`) }}
        </p>
        <div class="row">
          <div class="col-lg-8">
            <InputUI
              :placeholder="$t(`account.settings.authentication.confirm2faActivationPlaceholder`)"
              small
              class="mb-3"
            />
          </div>
        </div>
      </div>

      <hr />

      <BaseButton type="button" mobile-full-width>{{ $t(`account.settings.authentication.enable2faBtn`) }}</BaseButton>
    </div>
  </CardUi>
</template>

<script setup>
import { reactive } from "vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import InputUI from "@/components/base/BaseInput.vue";
import QrCode from "@/components/base/BaseQr/BaseQr.vue";

const state = reactive({
  showAuthenticator: false,
});
</script>

<style scoped lang="scss">
@import "~/assets/style/include.scss";
.authentication {
  &__title {
    margin-bottom: 10px;
  }
  &__subtitle {
    margin-bottom: 30px;
  }
  &__item {
    padding-left: 46px;
    margin-bottom: 30px;
    @include media-breakpoint-down("lg") {
      padding-left: 0;
    }
    &-title {
      position: relative;
      @include media-breakpoint-down("lg") {
        margin-bottom: 15px;
        margin-left: 46px;
      }
      &:before {
        position: absolute;
        top: 50%;
        left: -46px;
        display: inline-block;
        width: 36px;
        height: 36px;
        font-size: 14px;
        font-weight: 700;
        line-height: 33px;
        text-align: center;
        content: "1";
        border: 2px solid $color-orange-dark;
        border-radius: 50%;
        transform: translate(0, -50%);
      }
    }
    &:nth-of-type(2) .authentication__item-title:before {
      content: "2";
    }
    &:nth-of-type(3) .authentication__item-title:before {
      content: "3";
    }
    &-warning {
      &:before {
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 7px;
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
        color: $color-primary-light;
        text-align: center;
        content: "?";
        background-color: $color-bg-lightest;
        border-radius: 50%;
      }
    }
  }
  &__qr {
    @include media-breakpoint-down("lg") {
      margin: 15px 0;
    }
  }
}
</style>
