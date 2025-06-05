<template>
  <div>
    <CompanyInfo />
    <div class="description-box">
      <div class="description-container">
        <IconGift width="40" height="40" />
        <div class="description-text" v-html="$t('signUp.description.gift')">
        </div>
      </div>
      <div class="description-container">
        <IconStudent width="40" height="40" />
        <div class="description-text" v-html="$t('signUp.description.student')">
        </div>
      </div>
      <div class="description-container">
        <IconTime width="40" height="40" />
        <div class="description-text" v-html="$t('signUp.description.times')">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CompanyInfo from "@/components/auth/CompanyInfo.vue";
import IconTime from "../icons/IconTime.vue";
import IconGift from "../icons/IconGift.vue";
import IconStudent from "../icons/IconStudent.vue";
</script>

<style lang="scss" scoped>
.description {
  &-box {
    display: flex;
    flex-direction: column;
    gap: 26px;
    @include media-breakpoint-down("md") {
      flex-direction: row;
      gap: 15px;
      justify-content: center;
    }
  }
  &-container {
    display: flex;
    gap: 20px;
    align-items: center;
    @include media-breakpoint-down("sm") {
      flex-direction: column;
      gap: 10px;
    }
  }
  &-text {
    max-width: 126px;
    font-size: 14px;
    font-weight: 700;
    line-height: 145%;
    @include media-breakpoint-down("md") {
      font-size: 12px;
    }
  }
}
</style>
