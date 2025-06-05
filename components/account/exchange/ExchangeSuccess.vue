<template>
  <div class="exchange-success">
    <h4 class="exchange-success__title d-flex align-items-center">
      <IconCheck class="me-2" /> {{ $t("common.btns.done") }}
    </h4>

    <div class="exchange-success__wrap">
      <div class="exchange-success__wrap-left">
        <div class="exchange-success__wrap-item">{{ $t("account.exchange.success.spent") }}</div>
        <div class="exchange-success__wrap-item">{{ $t("account.exchange.success.converted") }}</div>
        <div class="exchange-success__wrap-item">{{ $t("account.exchange.success.price") }}</div>
      </div>

      <div class="exchange-success__wrap-right">
        <div class="exchange-success__wrap-item">
          {{ from_amount }} <span class="fw-bold">{{ from_currency }}</span>
        </div>
        <div class="exchange-success__wrap-item">
          {{ to_amount }} <span class="fw-bold">{{ to_currency }}</span>
        </div>
        <div class="exchange-success__wrap-item">
          1 <span class="fw-bold">{{ from_currency }}</span> = {{ rate }} <span class="fw-bold">{{ to_currency }}</span>
        </div>
      </div>
    </div>

    <BaseButton type="button" color="tertiary" class="me-2 mb-2" @click="goToWallets">
      {{ $t("account.exchange.success.backToWallets") }}
    </BaseButton>

    <BaseButton type="button" color="secondary" @click="$emit('reset')">{{
      $t("account.exchange.success.exchangeAgain")
    }}</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import IconCheck from "@/components/icons/IconCheck.vue";
import { computed } from "vue";
import { path } from "@/constants/routes";
import { trimFloatNumber } from "~~/utils/processNumbers";

const props = defineProps(["infoData"]);
const emits = defineEmits("reset");
const { t } = useI18n();
const from_currency = computed(() => props.infoData.from_currency.display_code?.toUpperCase());
const to_currency = computed(() => props.infoData.to_currency.display_code?.toUpperCase());
const from_amount = computed(() => trimFloatNumber(props.infoData.from_amount));
const to_amount = computed(() => trimFloatNumber(props.infoData.to_amount));
const rate = computed(() => trimFloatNumber(props.infoData.rate));

function goToWallets() {
  navigateTo(path.account.wallets);
}
</script>

<style scoped lang="scss">
.exchange-success {
  padding: 0 30px 30px;
  @include media-breakpoint-up("xl") {
    width: 50%;
  }
  @include media-breakpoint-down("sm") {
    padding-top: 30px;
  }
}

.exchange-success__title {
  margin-bottom: 15px;
}

.exchange-success__wrap {
  display: grid;
  grid-template-columns: 0fr 1fr;
  gap: 30px;
  padding: 22px 30px;
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  color: $color-text-dark;
  border: 1px solid $color-disable-light;
  border-radius: 4px;
}

.exchange-success__wrap-left,
.exchange-success__wrap-right {
  display: grid;
  grid-template-rows: 3fr;
  grid-template-columns: 1fr;
  gap: 15px;
}
</style>
