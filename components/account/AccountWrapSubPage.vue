<template>
  <BaseCard in-content class="ui-card--shadowed d-sm-block" :class="{ hideWhenMobile: hideWhenMobile }" v-if="label">
    <div v-if="withGoBack" @click="$emit('goBack')" class="goback d-flex align-items-start">
      <IconGoBack class="me-2 backButton" />
      {{ $t("common.btns.goBack") }}
    </div>

    <h3>{{ label }}</h3>
  </BaseCard>

  <slot />
</template>

<script setup>
import BaseCard from "@/components/base/BaseCard/BaseCard.vue";
import IconGoBack from "~/components/icons/IconGoBack";

defineProps({
  withGoBack: {
    type: Boolean,
    default: false,
  },
  label: String,
  hideWhenMobile: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["goBack"]);
</script>

<style scoped lang="scss">
.goback {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  cursor: pointer;
  @include media-breakpoint-down("sm") {
    font-size: 16px;
  }
}
.backButton {
  @include media-breakpoint-down("sm") {
    width: 16px;
    height: 16px;
  }
}

.hideWhenMobile {
  @include media-breakpoint-down("sm") {
    display: none;
  }
}
</style>
