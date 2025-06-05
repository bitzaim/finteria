<script setup>
import { ref, computed } from "vue";
import IconBonusBox from "@/components/icons/IconBonusBox.vue";

const props = defineProps({
  bonus: {
    type: Array,
  },
  rangeValue: {
    requried: true,
  },
  marks: {
    type: Array,
    default: [],
  },
  activatedBonus: {
    type: Object,
    requried: true,
  },
});

const emits = defineEmits(["update:rangeValue", "bonusClick"]);
const bonusData = computed(() => props.bonus.map((item) => item.value));

const minValueRange = ref(0);
const maxValueRange = ref(1140);

const percentageRange = ref(0);
// distance assignment and percentage calculation
function setRangeValue(e) {
  emits("update:rangeValue", e);
  percentageRange.value = (e / maxValueRange.value) * 100;
}
const percentagedRange = computed(() => (props.rangeValue / maxValueRange.value) * 100);

const activatedBreakPoints = computed(() => Math.floor(percentagedRange.value / 33.3));

function handleBonusClick(index) {
  emits("bonusClick", index);
}
</script>

<style lang="scss" scoped>
.wrapper__range {
  max-width: 665px;
  margin-bottom: 20px;
}
.range-area {
  position: relative;
  width: 100%;
}
.range-input {
  position: absolute;
  top: -6px;
  z-index: 3;
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  -webkit-appearance: none;
  &::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    cursor: pointer;
    background: $color-primary;
    border-radius: 2px;
    -webkit-appearance: none;
    appearance: none;
  }
}
.range__breakpoint-list {
  position: absolute;
  left: 5px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 10px);
  height: 4px;
  margin: 0 auto;
  background-color: $slider-bg;
  border-radius: 0 0 2px 2px;
}
.range__breakpoint {
  position: relative;
  top: -5px;
  left: 0;
  width: 4px;
  height: 5px;
  background-color: $slider-bg;
  border-radius: 2px 2px 0 0;
  &.active {
    background-color: $color-orange;
  }
  &-mark {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  &:first-child > &-mark {
    left: -4px;
    transform: translate(0, 0);
  }
  &:last-child > &-mark {
    left: -50%;
    transform: translate(calc(-100% + 4px), 0);
  }
}
.range__custom {
  position: absolute;
  left: 5px;
  z-index: 2;
  width: calc(100% - 10px);
  height: 4px;
  margin: 0 auto;
  & > span {
    display: block;
    width: 0;
    height: 4px;
    background-color: $color-orange;
    border-radius: 0 0 2px 2px;
  }
}
.bonus__boxs {
  position: relative;
  bottom: -22px;
  display: flex;
  gap: 4px;
  justify-content: space-between;
  width: calc(100% - 10px);
  margin: 0 auto;
}
.box-arrow {
  position: absolute;
  top: -5px;
  z-index: 0;
  display: none;
  width: 12px;
  height: 12px;
  background-color: $color-orange-dark;
  border-radius: 2px;
  transform: rotate(45deg);
}
.bonus__box {
  position: relative;
  display: flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 145%;
  cursor: pointer;
  background-color: $color-disable;
  border-radius: 4px;
  @include media-breakpoint-down("sm") {
    font-size: 12px;
    line-height: 125%;
  }
  & > span.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    @include media-breakpoint-down("sm") {
      width: 20px;
      height: 20px;
    }
  }
  &.active {
    color: $color-white;
    background-color: $color-orange-dark;
    & .box-arrow {
      display: block;
    }
  }
}
.color-middle {
  color: $color-grey;
}
.range__distances {
  position: absolute;
  top: -30px;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 10px);
  margin: 0 auto;
}
</style>

<template>
  <div class="wrapper__range">
    <div class="range-area">
      <input
        type="range"
        :min="minValueRange"
        :max="maxValueRange"
        step="1"
        :value="rangeValue"
        @input="setRangeValue($event.target.value)"
        class="range-input"
      />
      <div class="range__breakpoint-list">
        <div
          v-for="(mark, index) in marks"
          :key="index"
          class="range__breakpoint"
          :class="{ active: activatedBreakPoints >= index }"
        >
          <p class="range__breakpoint-mark">
            {{ mark }}
          </p>
        </div>
      </div>
      <div class="range__custom">
        <span :style="{ width: (rangeValue / maxValueRange) * 100 + '%' }"></span>
      </div>
      <div class="bonus__boxs">
        <div
          class="bonus__box text-default color-middle"
          v-for="(bonus, index) in bonusData"
          @click="handleBonusClick(index + 1)"
          :key="index"
          :class="{
            active: activatedBonus?.value == bonus,
          }"
        >
          <span class="icon"> <icon-bonus-box /> </span>
          Bonus + {{ bonus }}%
          <span class="box-arrow"></span>
        </div>
      </div>
    </div>
  </div>
</template>
