<template>
  <div class="calc">
    <div class="calc__inner">
      <div class="calc__title" v-html="$t('trade.game-widget-title')"></div>
      <div class="calc__group" v-if="state.loaded">
        <div class="calc__wrapper">
          <div class="calc__col">
            <div class="calc__name">{{ $t("trade.calculator.selectAsset") }}</div>
            <SelectAsset
              v-if="state.activePair"
              @change="changePair"
              :pairs="pairs"
              :pair="state.activePair"
              :disabled="state.selectDisabled"
            />
          </div>
          <div class="calc__col">
            <label for="input-invest" class="calc__name">{{ $t("trade.calculator.investment") }}</label>
            <div class="input-box">
              <div class="input-prefix">$</div>
              <input
                type="text"
                id="input-invest"
                class="input-invest"
                v-model="investment"
                :disabled="state.selectDisabled"
                @keypress="validateWholeNumbers"
              />
            </div>
          </div>
          <div class="calc__col">
            <label for="input-size" class="calc__name">{{ $t("trade.calculator.profitability") }}</label>
            <input type="text" id="input-size" class="calc__input" v-model="profitability" readonly />
          </div>
        </div>

        <div class="calc__content">
          <div class="calc__timer" v-if="selectedButton.length">
            <img src="/icons/clock.svg" alt="icon" class="calc__timer-icon" />
            <span>{{ timer }}</span>
          </div>
          <div class="calc__graph-buttons" v-if="!state.action">
            <button class="calc__graph-button" @click.prevent="selectAction('buy', true)">
              <div class="calc__button-name calc__button-name--mt">BUY</div>
              <div class="calc__button-text">Price will go UP</div>
            </button>
            <button class="calc__graph-button calc__graph-button--red" @click.prevent="selectAction('sell', true)">
              <div class="calc__button-text calc__button-text--mt">Price will go DOWN</div>
              <div class="calc__button-name">SELL</div>
            </button>
          </div>

          <section class="chart__wrapper">
            <ClientOnly>
              <Graphic
                v-if="state.activePair"
                class="chart__graphic"
                :pair="state.activePair"
                :labels-visible="isLabelVisible"
                :action="state.action"
                :investment="investment"
                @predictEnd="showProfit"
                :key="graphicKey"
              />
            </ClientOnly>
          </section>

          <div class="calc-modal" :class="{ open: modalCalcVisible }">
            <div class="calc-modal__row" @click="refreshTool">
              <div class="calc-modal__circle">
                <img src="/icons/coins.svg" alt="icon" class="calc-modal__icon" />
              </div>
              <div class="calc-modal__box">
                <div class="calc-modal__overhead">
                  {{ profitSize > 0 ? "Your forecast was correct!" : "Try again!" }}
                </div>
                <div class="calc-modal__title" :class="{ wrong: profitSize < 0 }">
                  {{ profitSize > 0 ? `Profit: $${profitSize}` : `Loss: -$${Math.abs(profitSize)}` }}
                </div>
              </div>
            </div>

            <button class="calc-modal__button" @click.prevent="claimBonus">
              {{ $t("header.btns.signup") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorState, Pair } from "@/types/calculator.type";

import { path } from "@/constants/routes";
import { useUserStore } from "@/stores/userStore";
import { validateWholeNumbers } from "@/utils/processNumbers";
import { useDomain } from "@/composition/useDomain";

import SelectAsset from "./SelectAsset.vue";

const Graphic = defineAsyncComponent(() => import("./Graphic.vue"));

const props = defineProps<{
  data: any;
}>();

const pairs = ref<Pair[]>([]);
const state = reactive<CalculatorState>({
  id: 0,
  leverage: undefined,
  cryptoCurr: "",
  fiatCurr: "",
  price: undefined,
  loaded: false,
  activePair: undefined,
  action: undefined,
  selectDisabled: false,
});
const localePath = useLocalePath();
// Calc graph
const modalCalcVisible = ref(false);
const profitSize = ref<number>(0);
const isLabelVisible = ref(false);
// let dynamicTimer = null;
const selectedButton = ref<string>("");
const graphicKey = ref("thisMustBeRandomKey");
const userStore = useUserStore();
const { optionsPlatformURL } = useDomain();

watch(
  () => props.data,
  (newValue) => {
    if (newValue?.success) {
      pairs.value = newValue.data;
      state.activePair = newValue.data[0];

      if (state.activePair) {
        const pairNames = state.activePair.pair.split("/");
        const [from, to] = pairNames;
        state.activePair.numbersAfterDecimal = state.activePair.visual_divisibility;
        state.leverage = state.activePair.leverage;
        state.price = Number(state.activePair.price);
        state.cryptoCurr = from;
        state.fiatCurr = to;
      }

      state.loaded = true;
    }
  },
  {
    immediate: true,
  }
);

const changePair = (pair: Pair) => {
  state.activePair = pair;
  state.id = pair.id;
  const pairNames = pair.pair.split("/");
  const from = pairNames[0];
  const to = pairNames[1];
  state.activePair.numbersAfterDecimal = state.activePair.numbersAfterDecimal = state.activePair.visual_divisibility;
  state.cryptoCurr = from;
  state.fiatCurr = to;
  state.leverage = pair.leverage;
  if (state.action) {
    refreshTool();
  }
};

const selectAction = (type: string, label: boolean = true) => {
  selectedButton.value = type;
  isLabelVisible.value = label;
  state.action = type;
  state.selectDisabled = true;
  const endTimer = setInterval(() => {
    if (timer.value === 9) {
      clearInterval(endTimer);
      modalCalcVisible.value = true;
      state.selectDisabled = false;
    }
    timer.value += 1;
  }, 1000);
};

const showProfit = (profit: number) => {
  profitSize.value = profit;
};

function refreshTool() {
  modalCalcVisible.value = false;
  state.action = undefined;
  isLabelVisible.value = false;
  timer.value = 1;

  graphicKey.value = `thisIsStillRandomNumber +${Date.now()}`;
}

// Calc trade size
const investment = ref<number>(1000);
const profitability = ref<string>("90 %");
const timer = ref<number>(1);

// Scroll to register
const claimBonus = async () => {
  if (userStore.user) {
    await navigateTo(
      { path: `${optionsPlatformURL.value}redirect?userID=${userStore.user.id}` },
      { external: true }
    );
  } else {
    navigateTo({ path: localePath(path.auth.signUp) });
  }
};
</script>

<style scoped lang="scss">
.chart__wrapper {
  overflow: hidden;
}

.chart__graphic {
  margin-left: -18.5%;
}

.wrong {
  color: $color-danger-lightest;
}
</style>
