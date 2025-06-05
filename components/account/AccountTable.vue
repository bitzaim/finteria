<template>
  <div class="table-mobile" :style="{ 'grid-template': gridTemplate }">
    <div
      v-for="(column, key) in Object.keys(columns)"
      :key="key"
      :class="[
        'table-mobile__head',
        { 'table-mobile__head-btns': column === 'btns' && (type === 'md' || type === 'sm' || props.compact) },
      ]"
    >
      {{ rt(props.columns[column]) }}
    </div>

    <div
      v-for="(item, key) in calcRows"
      :key="key"
      :class="[
        'table-mobile__item',
        { 'table-mobile__item_btns': item.prop === 'btns' && (type === 'md' || type === 'sm' || props.compact) },
      ]"
      :style="{
        'grid-area': item.prop === 'btns' ? gridArea : 'auto',
        'border-bottom': item.prop !== 'btns' && props.compact ? 0 : '',
      }"
    >
      <component v-if="item.prop === 'icon'" class="table__icon" :is="currentIcon[item.row[item.prop]]" />

      <p v-else class="table__text">
        <span v-if="item.prop == 'ip'">{{ item.row.ip }}</span>
        <slot v-else :row="item.row" :prop="item.prop">{{ item.row[item.prop] }}</slot>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import IconMobile from "@/components/icons/IconMobile.vue";
import IconDesktop from "@/components/icons/IconDesktop.vue";
import { useBreakpoints } from "@/utils/useBreakpoints";
const { type } = useBreakpoints();
//todo: Pagination
const { rt } = useI18n();
const currentIcon = {
  desktop: IconDesktop,
  mobile: IconMobile,
};

const props = defineProps({
  columns: { type: Object, required: true },
  rows: { type: Array, required: true },
  compact: { type: Boolean, default: false },
});

const mobileSizes = ["sm", "md"];
const columnsLenght = computed(() => Object.keys(props.columns).length);
const isWithBtns = computed(() => Object.keys(props.columns).includes("btns"));
const calcRows = computed(() => {
  let arr = [];
  props.rows.forEach((row) => {
    Object.keys(props.columns).forEach((column) => {
      arr.push({
        row,
        prop: column,
      });
    });
  });
  return arr;
});
const gridTemplate = computed(() => {
  const g_t_rows = calcRows.value.length / columnsLenght.value + 1;
  return `repeat(${g_t_rows}, auto) / repeat(${
    columnsLenght.value - ((mobileSizes.includes(type.value) && isWithBtns.value) || props.compact ? 1 : 0)
  }, auto)`;
});

const gridArea = computed(() => {
  return `auto / span ${mobileSizes.includes(type.value) || props.compact ? columnsLenght.value - 1 : 1} `;
});
</script>

<style lang="scss">
.table-mobile {
  display: grid;
  min-width: 100%;
  padding: 0 30px;
  margin-bottom: 30px;
  @include media-breakpoint-down("md") {
    padding: 0;
  }
}

.table-mobile__head {
  padding: 7px 5px;
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  color: $color-grey;
  white-space: pre;
  background: $color-bg-grey;
  border-bottom: 0;
  @include media-breakpoint-down("md") {
    padding: 15px 10px;
  }
}

.table-mobile__head-btns {
  display: none;
}

.table-mobile__item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 145%;
  color: $color-text-darkest;
  vertical-align: middle;
  border-bottom: 1px solid $color-border-pre-dark;
  @include media-breakpoint-down("lg") {
    padding: 10px;
    border-bottom: 0;
  }
  @include media-breakpoint-down("sm") {
    padding: 5px;
    line-height: 100%;
  }
}

.table-mobile__item_btns {
  @include media-breakpoint-down("lg") {
    & button {
      font-size: 10px !important;
    }
  }
  padding-top: 0;
  margin-top: -5px;
  border-bottom: 1px solid $color-border-pre-dark;
}

.table-responsive {
  max-width: 100vw;
  padding-bottom: 30px;
}

.table__icon {
  font-size: 26px;
  color: $color-primary;
}

.table__text {
  width: 100%;
  font-family: "Open Sans", sans-serif;
  text-transform: capitalize;
  @include media-breakpoint-down("lg") {
    font-size: 12px;
  }
}
</style>
