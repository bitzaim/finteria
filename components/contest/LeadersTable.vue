<template>
  <div class="leaders-table">
    <div class="leaders-table__period">
      <p class="leaders-table__period-title">{{ $t("contest.leaders.periodTitle") }}:</p>
      <p class="leaders-table__period-range">{{ periodFromFormatted }} - {{ periodToFormatted }}</p>
    </div>

    <div class="leaders-table__updater">
      <button
        class="leaders-table__change-period leaders-table__change-period_prev"
        type="button"
        :title="$t('contest.leaders.periodPrev')"
        @click="onChangePeriod(false)"
        :disabled="isPrevPeriodDisabled"
      />
      <button
        class="leaders-table__change-period leaders-table__change-period_next"
        type="button"
        :title="$t('contest.leaders.periodNext')"
        @click="onChangePeriod(true)"
        :disabled="isNextPeriodDisabled"
      />
    </div>

    <table class="leaders-table__table">
      <thead>
        <tr>
          <th class="leaders-table__head">#</th>
          <th class="leaders-table__head">{{ $t("contest.leaders.table.headers.name") }}</th>
          <th class="leaders-table__head">{{ $t("contest.leaders.table.headers.trades") }}</th>
          <th class="leaders-table__head">{{ $t("contest.leaders.table.headers.prize") }}</th>
          <th class="leaders-table__head">{{ $t("contest.leaders.table.headers.prizeTrades") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="leader in leaders" class="leaders-table__row" :key="leader.id">
          <td class="leaders-table__column leaders-table__column_rank">{{ leader.rank }}.</td>
          <td class="leaders-table__column leaders-table__column_name">{{ leader.name }}</td>
          <td class="leaders-table__column">
            <span class="leaders-table__trades">{{ leader.num_trades }}</span>
          </td>
          <td class="leaders-table__column">
            <span class="leaders-table__prize">$ {{ getPrize(leader.rank) }}</span>
          </td>
          <td class="leaders-table__column">
            <span class="leaders-table__prize">$ {{ getPrize(leader.rank) }}</span>
            <span class="leaders-table__trades">{{ leader.num_trades }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { startOfWeek, endOfWeek, addWeeks, subWeeks, differenceInWeeks } from "date-fns";
import { formatDateStandart, formatDateSpecial } from "@/utils/date";
import { formatPriceSpace } from "@/utils/price";
import { getContestWeekly } from "@/services/contest";

const emit = defineEmits(["change-period"]);

const periodFrom = ref<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
const periodTo = ref<Date>(endOfWeek(new Date(), { weekStartsOn: 1 }));

const periodFromFormatted = computed<string>(() => {
  return formatDateStandart(periodFrom.value);
});

const periodToFormatted = computed<string>(() => {
  return formatDateStandart(periodTo.value);
});

const isPrevPeriodDisabled = computed<boolean>(() => {
  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const diff = differenceInWeeks(startWeek, periodFrom.value);

  return diff === 2;
});

const isNextPeriodDisabled = computed<boolean>(() => {
  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const diff = differenceInWeeks(startWeek, periodFrom.value);

  return diff === 0;
});

const onChangePeriod = (next: boolean) => {
  if (next) {
    periodFrom.value = addWeeks(periodFrom.value, 1);
    periodTo.value = addWeeks(periodTo.value, 1);
  } else {
    periodFrom.value = subWeeks(periodFrom.value, 1);
    periodTo.value = subWeeks(periodTo.value, 1);
  }
};

const { data: leaders } = await useAsyncData(
  "leaders",
  () => {
    return getContestWeekly(formatDateSpecial(periodFrom.value), formatDateSpecial(periodTo.value));
  },
  {
    watch: [periodFrom, periodTo],
  }
);

const getPrize = (rank: number) => {
  switch (rank) {
    case 1:
      return formatPriceSpace(5000);
    case 2:
      return formatPriceSpace(4000);
    case 3:
      return formatPriceSpace(3000);
    case 4:
    case 5:
    case 6:
      return formatPriceSpace(1000);
    default:
      return formatPriceSpace(500);
  }
};
</script>

<style scoped lang="scss">
.leaders-table {
  display: grid;
  grid-template-columns: 1fr 60px;
  row-gap: 20px;
  padding: 30px 20px;
  background-color: $color-primary-light-trade;

  @include media-breakpoint-up("md") {
    padding: 60px;
  }

  @include media-breakpoint-up("lg") {
    max-width: 960px;
  }
}

.leaders-table__period-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 14px;
    line-height: 1.45;
  }
}

.leaders-table__period-range {
  font-size: 14px;
  line-height: 1.45;
}

.leaders-table__change-period {
  position: relative;
  width: 30px;
  height: 30px;
  background-color: $color-white;
  border: 1px solid $color-disable-light;
}

.leaders-table__change-period::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  content: "";
  background-image: url("/icons/arrow.svg");
  background-repeat: no-repeat;
  background-position: 50% 60%;
  background-size: contain;
}

.leaders-table__change-period_prev {
  border-right: none;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.leaders-table__change-period_prev::before {
  transform: translateX(-50%) translateY(-50%) rotate(90deg);
}

.leaders-table__change-period_next {
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.leaders-table__change-period_next::before {
  transform: translateX(-50%) translateY(-50%) rotate(-90deg);
}

.leaders-table__table {
  grid-column: 1 / 3;
}

.leaders-table__head {
  padding-bottom: 7px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: $color-head-light;
  border-bottom: 2px solid $color-head-border;

  @include media-breakpoint-up("md") {
    font-size: 14px;
    line-height: 1.45;
  }
}

.leaders-table__head:nth-child(3),
.leaders-table__head:nth-child(4) {
  display: none;

  @include media-breakpoint-up("md") {
    display: table-cell;
  }
}

.leaders-table__head:nth-child(4) {
  @include media-breakpoint-up("md") {
    text-align: center;
  }
}

.leaders-table__head:last-child {
  @include media-breakpoint-up("md") {
    display: none;
  }
}

.leaders-table__row {
  position: relative;
}

.leaders-table__column {
  padding: 5px 0;
  line-height: 1.4;
  border-bottom: 1px solid $color-head-border;

  @include media-breakpoint-up("md") {
    padding: 10px 0;
  }
}

.leaders-table__column_rank {
  font-size: 14px;
  font-weight: 500;

  @include media-breakpoint-up("md") {
    width: 36px;
    font-size: 18px;
  }
}

.leaders-table__column_name {
  position: relative;
  padding-left: 24px;
  font-size: 12px;
  font-weight: 400;

  @include media-breakpoint-up("md") {
    padding-left: 36px;
    font-size: 18px;
    line-height: 1.45;
  }
}

.leaders-table__column_name::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 18px;
  height: 18px;
  content: "";
  background-image: url(/icons/contest/regular.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%);

  @include media-breakpoint-up("md") {
    width: 28px;
    height: 28px;
  }
}

.leaders-table__column:nth-child(3),
.leaders-table__column:nth-child(4) {
  display: none;

  @include media-breakpoint-up("md") {
    display: table-cell;
  }
}

.leaders-table__column:nth-child(3) {
  @include media-breakpoint-up("md") {
    width: 100px;
    text-align: center;
  }
}

.leaders-table__column:nth-child(4) {
  @include media-breakpoint-up("md") {
    width: 90px;
    padding-right: 16px;
    text-align: right;
  }
}

.leaders-table__column:last-child {
  @include media-breakpoint-up("md") {
    display: none;
  }
}

.leaders-table__row:first-child .leaders-table__column_name::before {
  background-image: url(/icons/contest/gold.svg);
}

.leaders-table__row:nth-child(2) .leaders-table__column_name::before {
  background-image: url(/icons/contest/silver.svg);
}

.leaders-table__row:nth-child(3) .leaders-table__column_name::before {
  background-image: url(/icons/contest/bronze.svg);
}

.leaders-table__head:last-child,
.leaders-table__column:last-child {
  padding-right: 16px;
  text-align: right;
}

.leaders-table__prize {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 18px;
  }
}

.leaders-table__row:first-child .leaders-table__prize {
  color: $color-contest-gold;
}

.leaders-table__row:nth-child(2) .leaders-table__prize {
  color: $color-contest-silver;
}

.leaders-table__row:nth-child(3) .leaders-table__prize {
  color: $color-contest-bronze;
}

.leaders-table__row:first-child .leaders-table__column:nth-child(4)::before,
.leaders-table__row:first-child .leaders-table__column:last-child::before {
  background: $color-gradient-gold;
}

.leaders-table__row:nth-child(2) .leaders-table__column:nth-child(4)::before,
.leaders-table__row:nth-child(2) .leaders-table__column:last-child::before {
  background: $color-gradient-silver;
}

.leaders-table__row:nth-child(3) .leaders-table__column:nth-child(4)::before,
.leaders-table__row:nth-child(3) .leaders-table__column:last-child::before {
  background: $color-gradient-bronze;
}

.leaders-table__row:nth-child(2) .leaders-table__column:nth-child(4)::before,
.leaders-table__row:nth-child(3) .leaders-table__column:last-child::before,
.leaders-table__row:nth-child(3) .leaders-table__column:nth-child(4)::before,
.leaders-table__row:first-child .leaders-table__column:last-child::before,
.leaders-table__row:first-child .leaders-table__column:nth-child(4)::before,
.leaders-table__row:nth-child(2) .leaders-table__column:last-child::before {
  position: absolute;
  top: 50%;
  right: 0;
  width: 217px;
  height: 37px;
  content: "";
  border-radius: 0 20px 20px 0;
  transform: translateY(-50%);

  @include media-breakpoint-up("md") {
    height: 43px;
  }
}

.leaders-table__trades {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 9px;
  font-weight: 400;
  color: $color-grey;

  @include media-breakpoint-up("md") {
    font-size: 14px;
  }
}
</style>
