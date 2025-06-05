<template>
  <div class="modal">
    <h2 class="modal__title">
      {{ $t(`account.settings.verification.signAcceptanceTitle`) }}
    </h2>
    <p class="modal__text">
      {{ $t(`account.settings.verification.signAcceptanceDescription`) }}
    </p>
    <VerificationCanvasElement @save="save($event)" />
  </div>
</template>

<script setup lang="ts">
import VerificationCanvasElement from "./VerificationCanvasElement.vue";

const emits = defineEmits<{ (e: "save", value: Blob): void }>();

const save = (imageBlob: Blob) => {
  emits("save", imageBlob);
};
</script>

<style scoped lang="scss">
@import "~/assets/style/include.scss";

.modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  @include media-breakpoint-down("sm") {
    gap: 10px;
  }
}
</style>
