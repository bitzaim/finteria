<template>
  <div class="actions__block">
    <h2 class="info__title"><slot /></h2>
    <div class="info__subtitle">
      <div v-if="available">
        {{ $t(`account.exchange.actionBlock.balance`) }}:
        <span class="primary">{{ calcAvailable }}</span>
      </div>
    </div>

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
      :max="withMax && available"
      text-right
      type="number"
      :error="error || ''"
    />
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
  withMax: { type: Boolean, default: false },
  error: { type: [String, Boolean], default: false },
});
const emits = defineEmits(["update:currenctCurrency", "update:inputValue"]);
const calcAvailable = computed(
  () =>
    `${trimFloatNumber(
      props.available,
      props.currentCurrency.visual_divisibility || 2
    )} ${props.currentCurrency.display_code.toUpperCase()}`
);

function updateAmount(val) {
  if (isNaN(+val)) {
    emits("update:inputValue", 0);
    return;
  }
  emits("update:inputValue", trimFloatNumber(val, props.currentCurrency.divisibility));
}
</script>

<style scoped lang="scss">
.actions__block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 10px;
  @include media-breakpoint-up("md") {
    grid-template-columns: 1fr 260px;
  }
  @include media-breakpoint-down("sm") {
    grid-template-columns: 1fr;
  }
}

.info__title {
  margin: 0px;
  font-weight: 400;
  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}

.info__subtitle {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  text-align: right;
  @include media-breakpoint-up("md") {
    font-size: 14px;
  }
  @include media-breakpoint-down("sm") {
    order: 1;
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
