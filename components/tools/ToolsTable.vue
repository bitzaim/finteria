<template>
  <div class="tools-table">
    <table class="tools-table__table">
      <thead>
        <tr>
          <th class="tools-table__head tools-table__head_laptop">{{ $t("cryptocurrency.market") }}</th>
          <th class="tools-table__head tools-table__head_mobile">{{ $t("cryptocurrency.marketLast") }}</th>
          <th class="tools-table__head tools-table__head_laptop">{{ $t("cryptocurrency.last") }}</th>
          <th class="tools-table__head text-center">{{ $t("cryptocurrency.24h") }}</th>
          <th class="tools-table__head"></th>
        </tr>
      </thead>

      <TransitionGroup name="fade" tag="tbody">
        <tr v-for="item in showItems" :key="item.id">
          <td class="tools-table__column tools-table__market">
            <div class="tools-table__market-wrapper">
              <img
                class="tools-table__icon"
                :src="`/icons/${item.type}/${item.ticker.toLowerCase()}.svg`"
                :alt="item.ticker_with_slash"
                width="30"
                height="30"
              />

              <button v-if="isUserAuth" type="button" class="tools-table__ticker" @click="onTradeClick(item.ticker)">
                {{ item.ticker_with_slash }}
              </button>
              <NuxtLink v-else class="tools-table__ticker" :to="getToolLinkForNotAuth(item)">
                {{ item.ticker_with_slash }}
              </NuxtLink>

              <span class="tools-table__price tools-table__price_mobile">{{
                formatPriceComma(item.price, getFractionByPricescale(item.pricescale))
              }}</span>
            </div>
          </td>

          <td class="tools-table__column tools-table__column_laptop tools-table__price">
            {{ formatPriceComma(item.price, getFractionByPricescale(item.pricescale)) }}
          </td>

          <td
            class="tools-table__column tools-table__difference text-center"
            :class="{
              'tools-table__difference_negative': Number(item.difference_percentage) < 0,
            }"
          >
            {{ getDifferenceFormatted(Number(item.difference_percentage)) }}
          </td>

          <td class="tools-table__column tools-table__trade">
            <button
              v-if="isUserAuth"
              class="button button_small button_yellow tools-table__trade-link"
              @click="onTradeClick(item.ticker)"
              type="button"
            >
              {{ $t("cryptocurrency.trade") }}
            </button>

            <NuxtLink
              v-else
              class="button button_small button_yellow tools-table__trade-link"
              :to="getToolLinkForNotAuth(item)"
              target="_blank"
            >
              {{ $t("cryptocurrency.trade") }}
            </NuxtLink>
          </td>
        </tr>
      </TransitionGroup>
    </table>

    <button v-if="items.length > 11 && !showMore" class="tools-table__more" type="button" @click="onShowMoreClick">
      {{ $t("cryptocurrency.more") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Tool } from "@/services/types/tools.type";
import { getDifferenceFormatted } from "@/utils/tools";
import { redirectToDefaultProfilePlatform } from "@/services/helpers";
import { useUserStore } from "@/stores/userStore";
import { useDomain } from "@/composition/useDomain";

const { optionsPlatformURL } = useDomain();
const props = withDefaults(
  defineProps<{
    items: Tool[];
    type?: string;
  }>(),
  {
    type: "crypto",
  }
);

const userStore = useUserStore();
const isUserAuth = computed<boolean>(() => userStore.isAuth);

const showMore = ref<boolean>(false);

const showItemsLength = ref<number>(11);
const showItems = computed<Tool[]>(() => {
  return props.items.slice(0, showItemsLength.value);
});

const getToolLinkForNotAuth = (item: Tool) => {
  return `${optionsPlatformURL.value}?instrument=${item.ticker}`;
};

const onTradeClick = async (tool: string) => {
  try {
    await redirectToDefaultProfilePlatform({ instrument: tool, mock: true });
  } catch (err) {
    console.error(err);
  }
};

const onShowMoreClick = () => {
  showMore.value = true;
  showItemsLength.value = props.items.length;
};

const getFractionByPricescale = (pricescale: number): number => {
  return Math.ceil(Math.log(pricescale) / Math.log(10));
};
</script>

<style scoped lang="scss">
.tools-table {
  padding: 18px 20px 24px;
  background-color: $color-white;

  @include media-breakpoint-up("md") {
    padding: 60px 60px 54px;
  }
}

.tools-table__table {
  width: 100%;
}

.tools-table__head {
  padding: 0 10px 5px;
  font-size: 9px;
  font-weight: 400;
  line-height: 1.3;
  color: $color-head-light;

  @include media-breakpoint-up("md") {
    padding-bottom: 10px;
    font-size: 12px;
    line-height: 1.4;
  }
}

.tools-table__column {
  padding: 10px;
  border-bottom: 1px solid $color-border-light;
}

.tools-table__head_laptop,
.tools-table__column_laptop {
  display: none;

  @include media-breakpoint-up("md") {
    display: table-cell;
  }
}

.tools-table__head_mobile {
  @include media-breakpoint-up("md") {
    display: none;
  }
}

.tools-table__head:first-child,
.tools-table__head:nth-child(2),
.tools-table__column:first-child {
  padding-left: 0;
}

.tools-table__head:last-child,
.tools-table__column:last-child {
  padding-right: 0;
}

.tools-table__market-wrapper {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 30px 1fr;
  column-gap: 8px;
  align-items: center;

  @include media-breakpoint-up("md") {
    grid-template-rows: 1fr;
  }
}

.tools-table__icon {
  grid-row: 1 / 3;
  width: 30px;
  height: 30px;

  @include media-breakpoint-up("md") {
    margin-right: 10px;
    vertical-align: middle;
  }
}

.tools-table__ticker {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: $color-primary-hover;
  text-align: left;

  @include media-breakpoint-up("md") {
    font-size: 17px;
  }
}

.tools-table__price {
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  color: $color-grey;

  @include media-breakpoint-up("md") {
    font-size: 18px;
    line-height: 1.45;
  }
}

.tools-table__difference {
  font-size: 14px;
  font-weight: 500;
  color: $color-green-light;

  @include media-breakpoint-up("md") {
    font-size: 18px;
  }
}

.tools-table__difference_negative {
  color: $color-danger;
}

.tools-table__price_mobile {
  @include media-breakpoint-up("md") {
    display: none;
  }
}

.tools-table__trade-link {
  letter-spacing: 0;
  border-radius: 2px;
}

.tools-table__more {
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: $color-primary-hover;

  @include media-breakpoint-up("md") {
    font-size: 18px;
  }
}

.tools-table__more::after {
  width: 12px;
  height: 7px;
  margin-left: 8px;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg width='13' height='7' viewBox='0 0 13 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.414197 0.264632C0.784167 -0.0882108 1.38401 -0.0882108 1.75398 0.264632L6.13672 4.44448L10.5195 0.264632C10.8894 -0.0882108 11.4893 -0.0882108 11.8592 0.264632C12.2292 0.617476 12.2292 1.18955 11.8592 1.54239L6.13672 7L0.414197 1.54239C0.0442262 1.18955 0.0442262 0.617476 0.414197 0.264632Z' fill='%234785EF'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
