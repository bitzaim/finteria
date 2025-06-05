<template>
  <div class="">
    <div
      class="wrap"
      :class="{
        withStripes: props.withStripes,
        withStripesRevert: props.withStripes === 'revert',
      }"
    >
      <h1
        v-if="hasSlotContent($slots.header)"
        class="title"
        :class="{
          'text-center': props.headerCenter,
          'mb-2': hasSlotContent($slots.subtitle),
        }"
      >
        <slot name="header" />
      </h1>

      <h4 v-if="hasSlotContent($slots.subtitle)" :class="{ 'text-center': props.headerCenter }">
        <slot name="subtitle" />
      </h4>

      <div class="row" :class="{ 'g-0': props.noGutters }">
        <div v-if="hasSlotContent($slots.left)" :class="`${props.leftCol}`">
          <slot name="left" />
        </div>
        <div v-if="hasSlotContent($slots.right)" :class="`${props.rightCol}`">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { hasSlotContent } from "@/utils/hasSlotContent";

const props = defineProps({
  noGutters: {
    type: Boolean,
    default: false,
  },
  withStripes: {
    type: [Boolean, String],
    default: false,
  },
  leftCol: {
    type: String,
    default: "col-6",
  },
  rightCol: {
    type: String,
    default: "col-6",
  },
  headerCenter: {
    type: Boolean,
    default: false,
  },
  withLine: {
    type: Boolean,
    default: false,
  },
  center: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  z-index: 1;
  h1 {
    margin-bottom: 60px;
  }
  h4 {
    margin-bottom: 60px;
  }
  &.withStripes {
    position: relative;
    &.withStripesRevert {
      &:after {
        background-position: top left;
        transform: scale(1, -1);
      }
    }
  }
}
</style>
