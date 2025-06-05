<template>
  <div class="withdrawal__notification mb-2">
    <IconWarning />
    <p>
      <slot />
    </p>
  </div>
</template>

<script setup>
import IconWarning from "@/components/icons/IconWarning.vue";
</script>

<style lang="scss" scoped>
.withdrawal__notification {
  display: flex;
  gap: 25px;
  align-items: center;
  padding: 20px;
  font-weight: 400;
  color: $color-text-dark;
  background-color: $color-bg-status;
  border-radius: 4px;

  @include media-breakpoint-down("sm") {
    gap: 15px;
    padding: 10px;
  }

  & > svg {
    flex-shrink: 0;
  }
}
</style>
