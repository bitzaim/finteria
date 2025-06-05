<template>
  <div class="amount__wrap">
    <h6 class="amount__title">{{ $t(`account.trading.depositFirstPage.totalTradingDeposit`) }}:</h6>
    <div class="amount">{{ `${totalDeposite} ${bonusCurrency?.toUpperCase()}` }}</div>
  </div>
</template>

<script setup>
defineProps({
  totalDeposite: { type: Number, required: true },
  bonusCurrency: { type: String, required: true },
});
</script>

<style scoped lang="scss">
.amount__title {
  margin-bottom: 0px;
  font-size: 16px;
  color: $color-disable-dark;
}

.amount {
  font-size: 24px;
  font-weight: 700;
}
</style>
