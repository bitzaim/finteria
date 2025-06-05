<template>
  <transition name="expand" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
    <slot
  /></transition>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const transitioning = ref(false);
const show = ref(false);

const classObject = computed(() => {
  return {
    collapse: !transitioning.value,
    show: show.value && transitioning.value,
  };
});

function enter(element: any) {
  element.style.height = 0;
  element.style.height = `${element.scrollHeight}px`;
  transitioning.value = true;
  element.style.overflow = "hidden";
}

function afterEnter(element: any) {
  element.style.height = null;
  transitioning.value = false;
  element.style.overflow = "";
}

function leave(element: any) {
  element.style.height = "auto";
  element.style.overflow = "hidden";
  element.style.height = `${element.getBoundingClientRect().height}px`;
  transitioning.value = true;
  setTimeout(() => {
    element.style.height = 0;
  }, 1);
}

function afterLeave(element: any) {
  element.style.height = null;
  transitioning.value = false;
}
</script>

<style scoped lang="scss">
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.expand-enter-active {
  overflow: hidden;
  transition: height 0.6s ease-in-out;
}

.expand-leave-active {
  overflow: hidden;
  transition: height 0.4s ease-in-out;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>
