<template>
  <table class="trade-table">
    <thead>
      <tr>
        <th class="trade-table__head">
          {{ $t("trade.tradingExperience.topStrategies.tableHeader[0]") }}
        </th>
        <th class="trade-table__head">
          {{ $t("trade.tradingExperience.topStrategies.tableHeader[1]") }}
        </th>
        <th class="trade-table__head">
          {{ $t("trade.tradingExperience.topStrategies.tableHeader[2]") }}
        </th>
        <th class="trade-table__head" />
      </tr>
    </thead>
    <tbody>
      <tr class="trade-table__row" v-for="(row, index) in topStrategies" :key="row.id">
        <td class="trade-table__rank-wrapper">
          <span class="trade-table__rank">
            <span class="trade-table__rank-background">{{ index + 1 }}</span>
          </span>
        </td>
        <td class="trade-table__strategy">
          {{ row.pseudo }}

          <span v-if="row.type === 'ai'" class="trade-table__strategy-ai">
            <span class="visually-hidden">(AI)</span>
          </span>
        </td>
        <td class="trade-table__performance">{{ `+${row.performance} %` }}</td>
        <td class="trade-table__follow">
          <BaseButton size="small" type="button" @click="$emit('followStrategy', row)">
            {{ $t("trade.tradingExperience.topStrategies.buttonFollow") }}
          </BaseButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { TopStrategy } from "~/types/trade.type";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";

defineProps<{
  topStrategies?: TopStrategy[];
}>();
</script>

<style scoped lang="scss">
.trade-table {
  width: 100%;
  border-collapse: collapse;
}

.trade-table__head {
  padding: 0;
  padding-bottom: 12px;
  font-size: 9px;
  font-weight: 400;
  color: $color-white;
  text-transform: capitalize;
  border-bottom: 2px solid $color-white;
  opacity: 0.5;

  @include media-breakpoint-up("md") {
    font-size: 12px;
  }
}

.trade-table__head:nth-child(3) {
  padding-right: 16px;
  text-align: right;
}

.trade-table__row td {
  padding-top: 5px;
  padding-bottom: 6px;
  vertical-align: middle;

  @include media-breakpoint-up("md") {
    padding-top: 9px;
    padding-bottom: 9px;
  }
}

.trade-table__row {
  font-size: 14px;
  font-weight: 700;
  color: $color-white;
  text-transform: uppercase;
  border-bottom: 1px solid $color-primary-light;

  @include media-breakpoint-up("md") {
    font-size: 17px;
  }
}

.button_small {
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 300;
  color: $color-text-dark;
}

.trade-table__rank-wrapper {
  @include media-breakpoint-up("md") {
    width: 72px;
  }
}

.trade-table__rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 14px;
  background: conic-gradient(from 180deg at 50% 50%, $color-orange 0deg, transparent 360deg);
  border-radius: 50%;

  @include media-breakpoint-up("md") {
    width: 32px;
    height: 32px;
    margin-right: 40px;
  }
}

.trade-table__rank-background {
  display: inline-block;
  width: 20px;
  height: 20px;
  font-size: 10px;
  font-weight: 800;
  line-height: 20px;
  text-align: center;
  background: $color-primary;
  border-radius: 50%;

  @include media-breakpoint-up("md") {
    width: 28px;
    height: 28px;
    font-size: 13px;
    line-height: 28px;
  }
}

.trade-table__strategy-ai {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 12px;
  content: "";
  background-image: url("/icons/robot.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.trade-table__performance {
  padding-right: 16px;
  color: $color-orange;
  text-align: right;
}

.trade-table__follow {
  text-align: right;
}
</style>
