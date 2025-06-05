<script setup>
import IconBitGo from "../icons/IconBitGo.vue";
</script>
<template>
  <div class="company">
    <div class="company__logo">
      <IconBitGo width="89" height="23" />
    </div>

    <p class="company__description">
      {{ $t("login.fireBlock") }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.company {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: $color-grey-light;

  @media (max-width: 767px) {
    align-items: center;
    margin: 0 auto;
  }
}

.company__description {
  max-width: 241px;
  margin-bottom: 28px;
  font-size: 15px;
  font-weight: 400;
  line-height: 21.75px;
  color: $color-grey;

  @media (max-width: 767px) {
    max-width: unset;
    text-align: center;
  }
}

.company__logo {
  max-width: 150px;
  margin-right: 4px;
  margin-bottom: 20px;
}
</style>
