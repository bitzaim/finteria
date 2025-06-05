<template>
  <NuxtLayout name="top-background">
    <section class="payment-result">
      <div class="container payment-result__container">
        <p class="payment-result__text">
          {{ $t(`account.payment.${status}`) }}
        </p>

        <img class="payment-result__icon" :src="`/icons/${status}.svg`" width="60" height="60" />
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();

const status = computed<string>(() => {
  if (route.query.status) {
    return String(route.query.status);
  }

  return "success";
});
</script>

<style scoped lang="scss">
.payment-result {
  height: 400px;
}

.payment-result__container {
  display: grid;
  grid-template-rows: auto 60px;
  row-gap: 40px;
  align-content: center;
  height: 100%;
}

.payment-result__text {
  font-size: 46px;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
}

.payment-result__icon {
  justify-self: center;
  width: 60px;
  height: 60px;
}
</style>
