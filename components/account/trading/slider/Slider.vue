<template>
  <div class="slider__wrap">
    <SliderRange
      :bonus="bonus"
      :rangeValue="rangeValue"
      @update:rangeValue="changeValueRange"
      @bonus-click="handleBonusClick"
      :marks="bonusMarks"
      :activatedBonus="activatedBonus"
    />

    <BonusUserAction
      :bonus="bonus"
      :sale="activatedBonus"
      :bonus-currency="bonusCurrency"
      :bonus-currency-visual-divisibility="bonusCurrencyVisualDivisibility"
      :amountDeposit="modelValue"
      :totalDeposite="totalDeposite"
      @updateUserAmount="changeInput"
      @bonusIsActive="changeBonus"
      @togglePolicy="changePolicy"
      @update:rangeValue="rangeValue = $event"
    />

    <!--    <BonusAmount :totalDeposite="totalDeposite" :bonus-currency="bonusCurrency" />-->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import BonusUserAction from "@/components/account/trading/slider/BonusUserAction.vue";
import BonusAmount from "@/components/account/trading/slider/BonusAmount.vue";
import SliderRange from "./SliderRange.vue";
import { useTradingStore } from "@/stores/userTradingAccounts";
const tradingStore = useTradingStore();

const props = defineProps({
  levels: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(["update:modelValue", "update:bonusIsActive", "update:policyIsActive"]);

const bonusData = ref([]);
const modelValue = ref(0);
const bonusIsActive = ref(true);
const policyIsActive = ref(true);

async function fetchBonus() {
  bonusData.value = props.levels;
  modelValue.value = props.levels[0]?.level;
  // alert(1)
}
// fetchBonus();

onMounted(() => {
  fetchBonus();
  // tradingStore.SET_FETCHING(false)
});

watch(
  () => props.levels,
  () => fetchBonus()
);

const bonusCurrency = computed(() => bonusData.value[0]?.display_currency?.display_code);

const bonusCurrencyDivisibility = computed(() => bonusData.value[0]?.display_currency?.divisibility);

const bonusCurrencyVisualDivisibility = computed(() => bonusData.value[0]?.display_currency?.visual_divisibility);

const bonus = computed(() => {
  return bonusData.value.map((bonus, index, arr) => {
    const customBonusPercentage = tradingStore.invoice.custom_bonus_percentage;
    return {
      value: customBonusPercentage || bonus.percentage,
      range: [bonus.level, arr[index + 1] ? arr[index + 1].level - 1 : 5000],
    };
  });
});

const bonusMarks = computed(() => {
  if (bonusData.value.length) return [...bonusData.value.map((bonus) => bonus.level), 5000];
  return [];
});

const activatedBonus = computed(() => {
  if (tradingStore.invoice.custom_bonus_percentage) return { value: tradingStore.invoice.custom_bonus_percentage };
  if (modelValue.value > 5000) return bonus.value[2];
  if (modelValue.value < bonus.value[0]?.range[0]) return { value: 0 };

  return bonus.value.find(
    (box) => box?.range[0] <= Math.floor(modelValue.value) && box?.range[1] >= Math.floor(modelValue.value)
  );
});
const totalDeposite = computed(() => {
  const roundHelperString = `1e${bonusCurrencyVisualDivisibility.value}`;
  const roundHelper = Number.isNaN(+roundHelperString) ? 1 : +roundHelperString;
  return bonusIsActive?.value
    ? Math.floor((modelValue.value + (activatedBonus.value?.value * modelValue?.value) / 100) * roundHelper) /
        roundHelper
    : Math.floor(modelValue?.value * roundHelper) / roundHelper;
});

const changeBonus = function (event) {
  bonusIsActive.value = event;
  emits("update:bonusIsActive", event);
};

const changePolicy = function (event) {
  policyIsActive.value = event;
  emits("update:policyIsActive", event);
};

function changeInput(val) {
  emits("update:modelValue", val);
  modelValue.value = val;
  rangeValue.value = setRangeByInput(val);
}

// slider length calculation depending on the price
function setRangeByInput(val) {
  if (val < bonus.value[0]?.range[0]) return 0;
  if (val > bonus.value[2]?.range[1]) return 1140;

  const a = priceDistance.value * 380;

  // Range Distance Price
  const [start, end] = [bonus?.value[priceDistance.value]?.range[0], bonus?.value[priceDistance.value]?.range[1]];
  const distance = end - start;
  const difference = val - start;
  const b = (380 / 100) * Math.round(difference / (distance / 100));
  return a + b;
}

const rangeValue = ref(0);
// function for assigning a value to the slider and calculating the price depending on the length
function changeValueRange(event) {
  rangeValue.value = event;

  const stepCoffeciten = priceBreakPointsDistance.value / 380;
  const b = 380 - Math.round(activeBreakPoints.value * 380 - event);

  const valueForPrice = Math.floor(stepCoffeciten * b + beginValueRangePrice.value);

  modelValue.value = valueForPrice;
  emits("update:modelValue", valueForPrice);
}

function handleBonusClick(index) {
  if (index === activeBreakPoints.value) {
    return;
  }
  if (index === 1) changeValueRange(0);
  if (index === 2) changeValueRange(380);
  if (index === 3) changeValueRange(760);
}

const activeBreakPoints = computed(() => {
  if (rangeValue.value < 380) return 1;
  if (rangeValue.value < 760) return 2;
  if (rangeValue.value <= 1140) return 3;
});

// length between distance value
const priceBreakPointsDistance = computed(() => {
  if (activeBreakPoints.value == 1) {
    return bonus?.value[1]?.range[0] - bonus?.value[0]?.range[0];
  }
  if (activeBreakPoints.value == 2) {
    return bonus?.value[2]?.range[0] - bonus?.value[1]?.range[0];
  }
  if (activeBreakPoints.value == 3) {
    return bonus?.value[2]?.range[1] - bonus?.value[2]?.range[0];
  }
});

//  computed for get beginPrice in distance
const beginValueRangePrice = computed(() => {
  if (activeBreakPoints.value == 1) {
    return bonus?.value[0]?.range[0];
  }
  if (activeBreakPoints.value == 2) {
    return bonus?.value[1]?.range[0];
  }
  if (activeBreakPoints.value == 3) {
    return bonus?.value[2]?.range[0];
  }
});

// computed for get which distance actually
const priceDistance = computed(() => {
  if (
    Math.floor(modelValue.value) >= bonus?.value[0]?.range[0] &&
    Math.floor(modelValue.value) <= bonus?.value[0]?.range[1]
  )
    return 0;
  if (
    Math.floor(modelValue.value) >= bonus?.value[1]?.range[0] &&
    Math.floor(modelValue.value) <= bonus?.value[1]?.range[1]
  )
    return 1;
  if (
    Math.floor(modelValue.value) >= bonus?.value[2]?.range[0] &&
    Math.floor(modelValue.value) <= bonus?.value[2]?.range[1]
  )
    return 2;
});
</script>

<style scoped lang="scss">
.custom-dot {
  width: 100%;
  height: 100%;
  background: $color-primary-dark;
  border-radius: 0;
}

.vue-slider-wrap {
  padding: 0 20px;
}

.slider__wrap {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 750px;
  //padding-left: 30px;
  //padding-right: 30px;
  padding: 20px 0;
  @include media-breakpoint-down("sm") {
    padding-top: 30px;
  }
}

.custom-mark {
  position: absolute;
  top: -100%;
  white-space: nowrap;
  transform: translateX(-50%);
}

.custom-point {
  width: 4px;
  height: 9px;
  background: $color-primary-lightest;
}

.custom-label {
  position: absolute;
  bottom: calc(100% + 5px);
  transform: translateX(-50%);
}

.custom-mark_active .custom-point {
  background: $color-orange;
}

.bonus__wrap {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  @include media-breakpoint-down("sm") {
    gap: 2px;
  }
}
.bonus {
  display: flex;
  flex-grow: 1;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 10px 0px;
  color: $color-btn-disable;
  background: $color-disable;
  border-radius: 4px;
  transition: background $transition-time;
  @include media-breakpoint-down("sm") {
    gap: 3px;
    font-size: 12px;
    font-weight: 700;
    line-height: 140%;
    & svg {
      width: 18px;
      height: 18px;
    }
  }
}

.bonus_active {
  position: relative;
  font-weight: 700;
  color: $color-white;
  background: $color-orange-dark;
  &::after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    content: "";
    border-right: 6px solid transparent;
    border-bottom: 6px solid $color-orange-dark;
    border-left: 6px solid transparent;
    transform: translate(-50%, 0%);
  }
}

.bonus__icon {
  font-size: 24px;
}
</style>
