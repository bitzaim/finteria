<template>
  <ul class="tab-container">
    <li
      v-for="(tab, index) in tabs"
      :key="index"
      @click="$emit('update:modelValue', tab)"
      class="tab"
      :class="{ 'tab-active': tab.key === props.modelValue.key }"
    >
      <span>{{ tab.label }}</span>
    </li>
  </ul>
  <div v-for="(tab, index) in tabs" :key="index">
    <slot v-if="tab.key === active.key" :name="tab.key">
      {{ tab }}
    </slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
    required: true,
  },
  modelValue: Object,
});
const emit = defineEmits(["update:modelValue"]);

const active = computed(() => props.modelValue);
</script>

<style lang="scss" scoped>
.tab-container {
  display: flex;
  max-width: 100vw;
  margin-bottom: 0;

  overflow-x: auto;
  font-size: 13px;
  font-weight: 800;
  line-height: 140%;
  text-transform: uppercase;
  background-color: $color-primary-lightest;
  @include media-breakpoint-down("sm") {
    padding: 0px;
    font-size: 12px;
    font-weight: 700;
  }
}

.tab {
  position: relative;
  flex-shrink: 0;
  padding: 16px 30px;
  color: $color-primary;
  cursor: pointer;
  border-right: 1px solid $color-white;
  transition: background $transition-time;
  &:hover {
    background: darken($color-primary-lightest, 10%);
    &::after {
      position: absolute;
      top: 0;
      left: 50%;
      content: "";
      border-top: 6px solid $color-white;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      transform: translate(-50%, 0%);
      @include media-breakpoint-down("sm") {
        border-top: 6px solid $color-border-pre-dark-secondary;
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
      }
    }
  }

  @include media-breakpoint-down("sm") {
    flex-grow: 1;
    padding: 10px 0px;
    text-align: center;
  }
}

.tab-active {
  position: relative;
  color: $color-white;
  background-color: $color-primary;
  &:hover {
    background-color: $color-primary;
  }
  &::after {
    position: absolute;
    top: 0;
    left: 50%;
    content: "";
    border-top: 6px solid $color-white;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    transform: translate(-50%, 0%);
    @include media-breakpoint-down("sm") {
      border-top: 6px solid $color-border-pre-dark-secondary;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
    }
  }
}
</style>
