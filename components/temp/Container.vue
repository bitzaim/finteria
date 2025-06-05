<template>
  <div
    class="wrap"
    :style="`
		padding-top: ${props.paddingTop}px;
		padding-bottom: ${props.paddingBottom}px;
		background: ${props.background};
		`"
    :class="{
      withStripes: props.withStripes,
      withStripesRevert: props.withStripes === 'revert',
      'pb-0': props.paddingBottom === 0,
    }"
  >
    <div class="container" v-if="props.withBlueLine">BLUE LINE COMPONENTS</div>

    <div v-if="props.container" class="container">
      <slot></slot>
    </div>

    <slot v-else></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  withBlueLine: {
    type: Boolean,
    default: false,
  },
  container: {
    type: Boolean,
    default: false,
  },
  paddingTop: {
    type: [String, Number],
    default: 0,
  },
  paddingBottom: {
    type: [String, Number],
    default: 160,
  },
  center: {
    type: Boolean,
    default: false,
  },
  background: {
    type: String,
    default: "transperent",
  },
  withStripes: {
    type: [Boolean, String],
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  z-index: 1;
  @include media-breakpoint-down("md") {
    padding: 50px 0 !important;
  }
  &.pb-0 {
    @include media-breakpoint-down("md") {
      padding-bottom: 0 !important;
    }
  }

  &.withStripes {
    position: relative;
    &:after {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url("/img/landings/trade/bg-lines.svg");
      background-repeat: no-repeat;
      background-position: right top;
      background-size: contain;
    }
    &.withStripesRevert {
      &:after {
        background-position: top left;
        transform: scale(1, -1);
      }
    }
  }
}
</style>
