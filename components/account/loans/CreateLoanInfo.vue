<template>
  <!--  <div class="exchange__info" v-if="loanQuote">-->
  <div v-if="loanQuote">
    <h2 class="exchange__title">Summary</h2>
    <div class="exchange__info-table">
      <div class="exchange__info-table-row">
        <div class="exchange__info-table-col">Daily Rate</div>
        <div class="exchange__info-table-col">{{ dailyRate }}</div>
      </div>
      <div class="exchange__info-table-row">
        <div class="exchange__info-table-col">Daily Payment</div>
        <div class="exchange__info-table-col">{{ dailyPayment }}</div>
      </div>
      <div class="exchange__info-table-row">
        <div class="exchange__info-table-col">Origination Fee</div>
        <div class="exchange__info-table-col">
          {{ originationFee }} {{ loanQuote.loan_currency.code.toUpperCase() }}
        </div>
      </div>
      <div class="exchange__info-table-row">
        <div class="exchange__info-table-col">Loan-to-Value (LTV)</div>
        <div class="exchange__info-table-col">{{ loanQuote.ltv }}</div>
      </div>
      <div class="exchange__info-table-row">
        <div class="exchange__info-table-col">LTV Liquidation Threshold</div>
        <div class="exchange__info-table-col">{{ loanQuote.ltv_liquidation_threshold }}</div>
      </div>
      <div class="exchange__info-table-row">
        <div class="exchange__info-table-col">
          Liquidation Price
          <span class="text-uppercase">
            ({{ loanQuote.collateral_currency.display_code }}/{{ loanQuote.loan_currency.display_code }})
          </span>
        </div>
        <div class="exchange__info-table-col">
          {{
            trimFloatNumber(loanQuote.ltv_liquidation_price, props.loanQuote.loan_currency?.visual_divisibility || 6)
          }}
        </div>
      </div>
    </div>
    <hr />
  </div>
</template>

<script setup>
import { trimFloatNumber } from "@/utils/processNumbers";
const props = defineProps({
  loanQuote: {
    type: Object,
    required: true,
  },
});

const dailyRate = computed(() => {
  const output = props.loanQuote?.daily_rate * 100;
  if (isNaN(output)) {
    throw new Error("Daily rate from props is not correct");
  }
  return `${output} %`;
});

const dailyPayment = computed(() => {
  const output = trimFloatNumber(
    props.loanQuote?.loan_amount * props.loanQuote?.daily_rate,
    props.loanQuote.loan_currency?.visual_divisibility || 6
  );
  if (isNaN(output)) {
    throw new Error("Loan amount or Daily rate is not correct");
  }
  return `${output} ${props.loanQuote.loan_currency?.code?.toUpperCase()}`;
});

const originationFee = computed(() => {
  const multiplier = props.loanQuote.origination_fee / 100;
  return `${trimFloatNumber(
    props.loanQuote.loan_amount * multiplier,
    props.loanQuote.loan_currency?.visual_divisibility || 6
  )}`;
});
defineEmits(["execute"]);
</script>

<style lang="scss" scoped>
.exchange__info {
  padding: 0 30px 30px 30px;
}

.exchange__title {
  margin: 0 0 15px 0;
  font-weight: 400;
  @include media-breakpoint-up("md") {
    font-size: 24px;
  }
}

.exchange__info-table {
  display: flex;
  flex-direction: column;
}
.exchange__info-table-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  color: $color-text-darkest;
}
</style>
