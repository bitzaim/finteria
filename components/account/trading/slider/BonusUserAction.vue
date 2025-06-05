<template>
  <div class="user-action">
    <div class="user-action__row">
      <div class="user-action__row-deposit-title">
        <h6 class="amount__title">Your deposit</h6>
      </div>
      <div class="user-action__row-bonus-title">
        <h6 class="amount__title">
          {{ $t(`account.trading.depositFirstPage.bonus`) }}
        </h6>
      </div>
      <div class="user-action__row-amount-title">
        <h6 class="amount__title">{{ $t(`account.trading.depositFirstPage.totalTradingDeposit`) }}:</h6>
      </div>

      <div class="user-action__input-wrap">
        <input
          inputmode="decimal"
          :value="props.amountDeposit"
          class="user-action__input"
          @input="handler_input"
          @keypress="validateDecimals"
        />
        <img v-if="bonusCurrency" :src="`/icons/${bonusCurrency}.svg`" alt="" class="user-action__input__img" />
        {{ bonusCurrency?.toUpperCase() }}
      </div>

      <CheckboxUI
        :modelValue="bonusIsActive"
        @change="toggleBonus($event.target.checked)"
        class="align-items-center user-action__row-bonus-row"
      >
        <span>
          <b>{{ ` ${sale?.value} %` }}</b>
        </span>
      </CheckboxUI>

      <div class="amount__wrap align-items-center d-flex">
        <div class="amount">
          {{ `${totalDeposite} ${bonusCurrency?.toUpperCase()}` }}
        </div>
      </div>
    </div>
    <div class="user-action__policy">
      <CheckboxUI
        :modelValue="policyIsActive"
        @change="togglePolicy($event.target.checked)"
        :error="tradingStore.policyError"
        :disabled="!bonusIsActive"
      >
        <span
          >{{ $t(`account.trading.depositFirstPage.policyPrivacy`) }}
          <a href="/files/documents/bonus-policy.pdf" class="primary" download>{{
            $t(`account.trading.depositFirstPage.policyPrivacyLink`)
          }}</a></span
        >
      </CheckboxUI>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import CheckboxUI from "@/components/base/BaseCheckbox/BaseCheckbox.vue";
import { useTradingStore } from "@/stores/userTradingAccounts";
const tradingStore = useTradingStore();

const props = defineProps({
  sale: { required: true },
  amountDeposit: { type: Number, required: true },
  bonus: { type: Array, required: true },
  bonusCurrency: { type: String, default: "usd" },
  bonusCurrencyVisualDivisibility: { type: Number, default: 4 },
  totalDeposite: { type: Number, required: true },
});
const emits = defineEmits(["bonusIsActive", "togglePolicy", "update:rangeValue", "updateUserAmount"]);

const { sale } = toRefs(props);
// const { amountDeposit } = toRefs(props);
const { bonus } = toRefs(props);
const bonusIsActive = ref(true);
const policyIsActive = ref(true);

const bonusCounter = computed(() => (sale.value?.value * props.amountDeposit) / 100);

const policyError = computed(() => (bonusIsActive.value && !policyIsActive.value ? "Required" : false));

// const bonusCurrency = computed(() => props.bonusData[0]?.display_currency?.display_code)

const handler_input = function (event) {
  if (event.target.value < bonus.value[0]?.range[0]) {
    emits("update:rangeValue", 0);
  }
  if (event.target.value > bonus.value[2]?.range[1]) {
    emits("update:rangeValue", 1140);
  }
  if (isNaN(Number(event.target.value))) {
    emits("updateUserAmount", 0);
    return;
  }
  emits("updateUserAmount", Number(event.target.value));
};

function validateDecimals(e) {
  if (e.key !== "." && isNaN(Number(e.key))) {
    e.preventDefault();
    return;
  }
  const value = e.target.value;
  const commaIndex = value.indexOf(",");
  const dotIndex = value.indexOf(".");
  const separatorIndex = commaIndex !== -1 ? commaIndex : dotIndex;

  if (separatorIndex !== -1) {
    const decimalPart = value.slice(separatorIndex + 1);
    if (decimalPart.length >= props.bonusCurrencyVisualDivisibility) {
      e.preventDefault();
    }
  }
}

const toggleBonus = function (event) {
  bonusIsActive.value = event;
  emits("bonusIsActive", event);
};

const togglePolicy = function (event) {
  policyIsActive.value = event;
  emits("togglePolicy", event);
};
</script>

<style scoped lang="scss">
.user-action__input-wrap {
  display: flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  padding: 4px 16px;

  border: 1px solid $color-disable-light;
  border-radius: 4px;
  @include media-breakpoint-down("sm") {
    grid-area: 1 / 2 / 1 / 3;
    order: 1;
  }

  & > input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  & > input[type="number"] {
    -moz-appearance: textfield;
  }
}
.user-action__input {
  max-width: 100px;
  border: none;
  outline: none;
  @include media-breakpoint-down("sm") {
    max-width: 76px;
    margin-right: auto;
  }
}
.user-action__input__img {
  width: 20px;
  height: 20px;
}
.user-action {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.user-action__policy {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-action__row {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr 80px auto;
  row-gap: 10px;
  column-gap: 20px;
  @include media-breakpoint-down("sm") {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
}

.user-action__row-deposit-title {
  @include media-breakpoint-down("sm") {
    display: flex;
    grid-area: 1 / 1 / 1 / 2;
    align-items: center;
    justify-content: flex-start;
    order: 0;
    text-align: right;
  }
}

.user-action__row-bonus-title {
  @include media-breakpoint-down("sm") {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    order: 2;
    margin-top: 10px;
    text-align: right;
  }
}

.user-action__row-bonus-row {
  @include media-breakpoint-down("sm") {
    order: 3;
    margin-top: 10px;
  }
}

.user-action__row-amount-title {
  @include media-breakpoint-down("sm") {
    display: flex;
    grid-area: 4/1/4/2;
    align-items: center;
    justify-content: flex-start;
    order: 4;
  }
}

.primary {
  color: $color-primary;
  &:hover {
    color: $color-primary-hover;
  }
}

.user-action__icon {
  width: 24px;
  height: 24px;
  padding: 6px;
  color: $color-white;
  background: $color-green;
  border-radius: 6px;
}

.amount__title {
  margin-bottom: 0px;
  font-size: 16px;
  color: $color-disable-dark;
}

.amount {
  font-size: 24px;
  font-weight: 700;
  @include media-breakpoint-down("sm") {
    font-size: 20px;
  }
}

.amount__wrap {
  @include media-breakpoint-down("sm") {
    grid-area: 4/2/4/3;
    justify-content: flex-start;
    order: 5;
  }
}
</style>
