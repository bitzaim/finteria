<script setup>
import BaseInput from "@/components/base/BaseInput/BaseInput.vue";
import CheckboxUI from "@/components/base/BaseCheckbox/BaseCheckbox.vue";
import { useTradingStore } from "@/stores/userTradingAccounts";
import { useWalletsStore } from "@/stores/userWallets";
import Big from "big.js";
import { trimFloatNumber } from "@/utils/processNumbers";

const props = defineProps({
  levels: {
    type: Array,
    required: true,
  },
  isPolicyAgreed: {
    type: Boolean,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  error: { type: [String, Boolean], default: false },
});
const PRESELECT_PRICES = [100, 250, 500, 1000];
const emit = defineEmits(["update:modelValue", "update:policyIsActive"]);
const tradingStore = useTradingStore();
const walletsStore = useWalletsStore();

const activatedBonus = computed(() => {
  if (tradingStore.invoice.custom_bonus_percentage) return { percentage: tradingStore.invoice.custom_bonus_percentage };
  // if (modelValue.value > 5000) return props.levels.value[0];
  if (props.modelValue < props.levels[props.levels.length - 1].level) return { percentage: 0 };

  const output = props.levels.find((level) => {
    return props.modelValue >= level.level;
  });
  return output;
});

const totalDeposit = computed(() => {
  if (!props.isPolicyAgreed) {
    return props.modelValue || 0;
  }
  if (!props.modelValue) {
    return 0;
  }
  const beforeBonus = new Big(props.modelValue);
  const bonus = new Big(props.modelValue).times(Big(activatedBonus.value.percentage).div(100));

  const output = beforeBonus.plus(bonus);
  return trimFloatNumber(output, currentCurrency.value?.visual_divisibility);
});

const currency = props.levels?.[0].display_currency || "usd";
const currentCurrency = computed(() => {
  return walletsStore.currencies.find((curr) => curr.code === currency);
});

function handleAmount(val) {
  if (Number.isNaN(+val)) {
    emit("update:modelValue", 0);
    return;
  }

  emit("update:modelValue", trimFloatNumber(val, currentCurrency.value?.visual_divisibility));
}
onMounted(() => {
  // handleAmount(PRESELECT_PRICES[0]);
});
</script>

<template>
  <div class="amount-wrap">
    <div class="amount-input">
      <BaseInput
        small
        @update:modelValue="handleAmount"
        type="number"
        :modelValue="modelValue"
        inputmode="decimal"
        :error="props.error"
        :min="0"
      />
      <span>
        <img :src="`/icons/${currency}.svg`" alt="loan_currency" class="currency__img me-1" draggable="false" />
        {{ currency.toUpperCase() }}
      </span>
    </div>

    <div class="amount-buttons">
      <div
        v-for="price in PRESELECT_PRICES"
        @click="handleAmount(price)"
        class="amount-buttons__button"
        :class="{ active: modelValue == price }"
      >
        ${{ price }}
      </div>
    </div>

    <div class="amount-summary">
      <div class="amount-summary__bonus">
        <span class="amount-summary__title">{{ $t(`account.trading.depositFirstPage.bonus`) }}</span>
        <span class="bonus__text">
          <img
            @click="emit('update:policyIsActive', !props.isPolicyAgreed)"
            :src="`/icons/gift_${props.isPolicyAgreed && activatedBonus.percentage ? 'opened' : 'closed'}.svg`"
            alt="gift active"
            class="bonus__icon"
          />
          {{ activatedBonus.percentage || 0 }} %
        </span>
      </div>

      <div class="amount-summary__total">
        <span class="amount-summary__title"> {{ $t(`account.trading.depositFirstPage.totalTradingDeposit`) }}: </span>
        <span class="total__text">{{
          currency === "usd" ? `$ ${totalDeposit}` : `${totalDeposit} ${currency.toUpperCase()}`
        }}</span>
      </div>
    </div>
    <div class="amount-policy">
      <CheckboxUI
        :modelValue="props.isPolicyAgreed"
        @change="emit('update:policyIsActive', $event.target.checked)"
        :error="tradingStore.policyError"
      >
        <span
          >{{ $t(`account.trading.depositFirstPage.policyPrivacy`) }}
          <a href="/files/documents/bonus-policy.pdf" class="primary" download>{{
            $t(`account.trading.depositFirstPage.policyPrivacyLink`)
          }}</a></span
        >
      </CheckboxUI>
    </div>
    <!-- <div class="amount-policy"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.currency__img {
  width: 20px;
  height: 20px;
}
.amount {
  &-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: space-between;
    @include media-breakpoint-down("sm") {
      gap: 20px;
    }
  }

  &-input {
    display: flex;
    justify-content: space-between;
    width: 415px;
    padding: 3px;
    vertical-align: bottom;
    background-color: $color-disable;
    border-radius: 4px;
    & > div:first-child {
      width: 100%;
    }
    @include media-breakpoint-down("sm") {
      width: 100%;
    }
    span {
      display: flex;
      align-items: center;
      padding: 0px 10px;
      color: $color-grey;
    }
  }

  &-buttons {
    display: flex;
    gap: 9px;
    justify-content: flex-start;

    &__button {
      width: 80px;
      padding: 12px 0px;
      font-family: "Manrope", sans-serif;
      font-style: normal;
      font-weight: 500;
      color: $color-primary;
      text-align: center;
      cursor: pointer;
      user-select: none;
      border: 1px solid $color-orange;
      border-radius: 4px;
      @include media-breakpoint-down("sm") {
        width: 70px;
        padding: 8px 0;
      }
      &.active {
        background-color: $color-orange-lightest;
      }
    }
  }

  &-summary {
    display: flex;
    gap: 30px;
    margin-bottom: 10px;
    color: $color-grey;
    &__bonus {
      .bonus__text {
        display: flex;
        align-items: center;
        width: 130px;
        font-size: 24px;
      }
      .bonus__icon {
        width: 26px;
        height: 26px;
        margin-right: 10px;
      }
    }

    &__total {
      color: $color-text-dark;
      .total__text {
        display: block;
        font-size: 24px;
        font-weight: 700;
      }
    }

    &__title {
      font-size: 18px;
      font-weight: 500;
      color: $color-grey;
    }
  }

  &-policy {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
