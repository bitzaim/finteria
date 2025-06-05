<template>
  <div class="loader">
    <Transition name="loader-animation" type="animation">
      <div
        v-if="show"
        :class="[
          'loader__primary-circle',
          { 'loader__primary-circle--expired': !props.completed && isExpired },
          { 'loader__primary-circle--completed': props.completed },
        ]"
        :style="{ 'animation-duration': props.completed ? '0s' : `${props.pendingTime}s` }"
      ></div>
    </Transition>
    <div :class="['loader__secondary-circle', { 'loader__secondary-circle--expired': isExpired }]"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  pendingTime: {
    type: Number,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
const show = ref(false);

const isExpired = computed(() => props.pendingTime < 0);

onMounted(() => {
  show.value = props.pendingTime;
});
</script>

<style scoped lang="scss">
.loader {
  position: relative;
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transform: rotate(45deg);

  @include media-breakpoint-down("md") {
    width: 40px;
    height: 40px;
    border-width: 5px;
  }

  &__secondary-circle {
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    content: "";
    border: 8px solid $slider-bg;
    border-radius: 50%;

    &--expired {
      border: 8px solid red;
    }

    @include media-breakpoint-down("md") {
      inset: -5px;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border-width: 5px;
    }
  }

  &__primary-circle {
    position: absolute;
    inset: -8px;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    content: "";
    border: 8px solid $color-primary-pre-light;
    border-radius: 50%;

    &--expired {
      border: 8px solid red;
    }

    &--completed {
      border: 8px solid $color-green-light;
    }

    @include media-breakpoint-down("md") {
      inset: -5px;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border-width: 5px;
    }
  }
}

@keyframes loader-animation {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}

.loader-animation-enter-active {
  animation-name: loader-animation;
  animation-timing-function: linear;
}
.loader-animation-leave-active {
  animation: loader-animation 500ms linear reverse;
}
</style>
