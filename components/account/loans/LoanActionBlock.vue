<template>
  <div class="actions__block">
    <div class="actions__block-top">
      <h2 class="info__title"><slot /></h2>
      <div class="info__subtitle">
        <div>
          <!-- decided to get from [profile exchange] because they are the same-->
          {{ $t(`account.exchange.actionBlock.balance`) }}:
          <span class="primary">{{ calcAvailable }}</span>
        </div>
      </div>
    </div>

    <div class="actions__block-bottom">
      <Select
        :selectList="currencyList"
        :selectedItem="currentCurrency"
        :border="true"
        @update:selectedItem="emits('update:currenctCurrency', $event)"
        :disabled="disabled"
        :with-balance="withBalance"
        isIcons
      />
      <InputUI
        @update:modelValue="updateAmount"
        :modelValue="inputValue"
        inputmode="decimal"
        small
        :disabled="disabled"
        text-right
        type="number"
        max-float="8"
        :error="error || ''"
      />
    </div>
  </div>
</template>

<script setup>
import Select from "@/components/base/BaseSelect/BaseSelect.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import { computed } from "vue";
import { trimFloatNumber } from "@/utils/processNumbers";

const props = defineProps({
  currentCurrency: { type: Object, required: true },
  currencyList: { type: Array, required: true },
  inputValue: { type: [String, Number] },
  amount: { type: Number },
  disabled: { type: Boolean, default: false },
  available: { type: String, default: "" },
  withBalance: { type: Boolean, default: false },
  error: { type: [String, Boolean], default: false },
});
const emits = defineEmits(["update:currenctCurrency", "update:inputValue"]);
const calcAvailable = computed(
  () =>
    `${trimFloatNumber(
      // props.available
      props.currentCurrency.balance,
      props.currentCurrency.visual_divisibility
    )} ${props.currentCurrency.display_code?.toUpperCase()}`
);

function updateAmount(val) {
  emits("update:inputValue", trimFloatNumber(val, props.currentCurrency.visual_divisibility));
}

updateAmount(props.currentCurrency?.loan_offer?.max_amount);
</script>

<style scoped lang="scss">
.actions__block {
  display: grid;
  //grid-template-columns: 1fr 1fr;
  grid-template-columns: 1fr;
  gap: 15px 10px;
  @include media-breakpoint-up("md") {
    //grid-template-columns: 260px 1fr;
  }
  @include media-breakpoint-down("sm") {
    grid-template-columns: 1fr;
  }
}

.actions__block-top {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 15px 10px;
  @include media-breakpoint-down("sm") {
    grid-template-columns: max-content auto;
  }
}

.actions__block-bottom {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 15px 10px;
  @include media-breakpoint-down("sm") {
    display: flex;
    justify-content: space-between;
    font-size: 12px;

    & > div {
      width: 130px;
    }
  }
}

.info__title {
  margin: 0px;
  font-weight: 400;
  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
  @include media-breakpoint-down("sm") {
    width: max-content;
    font-size: 16px;
  }
}

.info__subtitle {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  font-size: 14px;
  text-align: right;
  @include media-breakpoint-up("md") {
    font-size: 14px;
  }
  @include media-breakpoint-down("sm") {
    order: 1;
    font-size: 12px;
  }
}

.action__input {
  width: 100%;
  padding: 2px 10px;
  text-align: right;
  border: 1px solid $color-disable-light;
  border-radius: 4px;
  outline: none;
}

.primary {
  color: $color-primary;
}
</style>
