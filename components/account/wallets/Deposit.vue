<template>
  <CardUi in-content>
    <AppLoader v-if="isLoading" class="mt-5" />
    <template v-else>
      <div v-if="state.id">
        <div class="deposit-transaction-content">
          <div class="row">
            <div class="col-md-auto d-flex justify-content-center justify-content-md-start">
              <BaseQr v-if="state.address" :value="state.address" />
            </div>
            <div class="col">
              <div class="deposit-transaction-content__text">
                {{ $t(`account.wallets.walletsTab.deposit.scanQr`) }}
              </div>
              <template v-if="deposit.blockchain_networks?.length > 1">
                <div class="deposit-transaction-content__input-title">
                  {{ $t(`account.wallets.walletsTab.deposit.selectNetwork`) }}
                </div>
                <div class="row">
                  <div class="col col-md-8 col-lg">
                    <BaseSelect
                      :selectList="deposit.blockchain_networks"
                      :selectedItem="state.currentNetwork"
                      @update:selectedItem="selectNetwork"
                      enums
                      :border="true"
                    />
                  </div>

                  <div class="d-block d-sm-none mt-3"></div>
                </div>
              </template>
              <div class="deposit-transaction-content__input-title" v-if="state.type == 'permanent'">
                {{ $t(`account.wallets.walletsTab.deposit.depositAddress`) }}
              </div>
              <div class="deposit-transaction-content__input-title" v-else-if="state.type == 'rotational'">
                {{ $t(`account.wallets.walletsTab.deposit.rotationalAddress`) }}
              </div>
              <div class="row">
                <div class="col col-md-8 col-lg">
                  <Input v-model="state.address" small ref="inputAddress" />
                </div>

                <div class="d-block d-sm-none mt-3"></div>

                <div class="col-auto">
                  <BaseButton type="button" color="secondary" @click="copyValue('inputAddress')">
                    {{ $t(`account.wallets.walletsTab.deposit.copyBtn`) }}
                  </BaseButton>
                </div>
              </div>
              <div v-if="state.type == 'rotational'" class="mt-2" style="font-size: 14px">
                {{ $t(`account.wallets.walletsTab.deposit.beAwareAddresIsTemporary`) }}
              </div>
            </div>
          </div>
        </div>
        <div class="deposit-transaction-info">
          <div class="deposit-transaction-info__icon">
            <IconInfo />
          </div>
          <div class="deposit-transaction-info__wrap">
            <div class="deposit-transaction-info__title__text">
              <div>
                {{ depositMessage }}
              </div>
            </div>
          </div>
        </div>

        <hr />
        <div v-if="state.type != 'permanent'">
          <div class="deposit-transaction-timeblock__timer" vif>
            <div class="deposit-transaction-timeblock__status">
              <div class="deposit-transaction-timeblock__status-title">
                {{ $t(`account.trading.depositSecondPage.status`) }}
              </div>
              <div class="deposit-transaction-timeblock__status-text">
                <!--            {{ $t(`account.trading.depositSecondPage.statuses.waiting`) }}-->
                {{
                  isTimerNotExpired
                    ? $t(`account.trading.depositSecondPage.statuses.waiting`)
                    : $t(`account.trading.depositSecondPage.statuses.expired`)
                }}
              </div>
            </div>
            <div class="deposit-transaction-timeblock__timer-circle">
              <TransactionLoader :pending-time="expire_timer" />
            </div>
            <div class="deposit-transaction-timeblock__timer-time">
              <div class="deposit-transaction-timeblock__timer-counter"><p v-text="time" /></div>
              <div class="deposit-transaction-timeblock__timer-text">
                {{
                  isTimerNotExpired
                    ? $t(`account.trading.depositSecondPage.timeRemaining`)
                    : $t(`account.trading.depositSecondPage.timeIntervalExpired`)
                }}
              </div>
            </div>
          </div>
          <hr />
        </div>
        <div class="deposit-transaction-footer">
          <div class="row">
            <div class="col">
              <div
                v-if="te(`account.wallets.walletsTab.deposit.confirmationMessages.${deposit.currency.display_code}`)"
              >
                {{ t(`account.wallets.walletsTab.deposit.confirmationMessages.${deposit.currency.display_code}`) }}
              </div>
              <div v-else>
                {{ t(`account.wallets.walletsTab.deposit.confirmationMessage`) }}
              </div>
            </div>
            <div class="col-auto">
              <BaseButton type="button" color="secondary" @click="getBack">{{
                $t(`account.wallets.walletsTab.deposit.goBackBtn`)
              }}</BaseButton>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="deposit-transaction" style="display: flex; align-items: flex-end; justify-content: flex-end">
        <BaseButton type="button" color="secondary" @click="getBack">
          {{ $t(`account.wallets.walletsTab.deposit.goBackBtn`) }}
        </BaseButton>
      </div>
    </template>
  </CardUi>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import BaseSelect from "@/components/base/BaseSelect/BaseSelect.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import Input from "@/components/base/BaseInput/BaseInput.vue";
import BaseQr from "@/components/base/BaseQr/BaseQr.vue";
import IconInfo from "@/components/icons/IconInfo.vue";
import TransactionLoader from "../trading/TransactionLoader.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import profile from "@/services/profile";

import { useToast } from "@/library/vue-toast";
import standardizeDate, { correctUtcFormat } from "~~/utils/standardizeDate";

const $toast = useToast();
const i18n = useI18n();
const { t, te, rt, tm } = i18n;
const route = useRoute();

const props = defineProps({
  deposit: {
    required: true,
    default: () => {},
  },

  available_until: {},
});

const emits = defineEmits(["return"]);
const state = reactive({
  id: null,
  address: null,
  type: "",
  currentNetwork: null,
  available_until: null,
});
const depositMessage = computed(() => {
  const depositMessages = tm(`account.wallets.walletsTab.deposit.depositMessages`);
  const message = depositMessages[props.deposit.currency.display_code];

  if (!message) {
    return t(`account.wallets.walletsTab.deposit.depositMessage`, {
      m$sg: props.deposit.currency.display_code.toUpperCase(),
    });
  } else if (typeof message === "function") {
    return rt(message);
  } else {
    // multiple blockhain_networks
    if (message[state.currentNetwork]) {
      return rt(message[state.currentNetwork]);
    }
  }
});
const isLoading = ref(true);

function getBack() {
  navigateTo({
    query: {
      action: "wallets",
    },
  });
  emits("return");
}

async function selectNetwork(e) {
  if (state.currentNetwork === e) {
    return;
  }
  state.currentNetwork = e;
  state.id = null;
  isLoading.value = true;
  try {
    const { data } = await profile.receiveAddress(props.deposit.id, state.currentNetwork);
    if (data) {
      Object.assign(state, data);
    }
  } catch (error) {
    $toast.warning(e.response._data.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
}

async function init() {
  const deposit = props.deposit;
  const indexOfTrc20 = deposit.blockchain_networks?.findIndex((code) => code === "trc20") || null;
  if (indexOfTrc20 !== null && indexOfTrc20 !== -1) {
    state.currentNetwork = deposit.blockchain_networks[indexOfTrc20];
  } else {
    state.currentNetwork = deposit.blockchain_networks?.[0];
  }

  try {
    let network = state.currentNetwork || "";
    const { data } = await profile.receiveAddress(deposit.id, network);
    if (data) {
      Object.assign(state, data);
    }
  } catch (e) {
    $toast.warning(e.response._data.message, { position: "top-right" });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  init();
});
const inputAddress = ref();

const copyValue = (val) => {
  eval(val).value.input.select();
  document.execCommand("copy");
  $toast.success($t("common.btns.copied"), {
    position: "top-right",
  });
};
const activeDeposit = computed(() => {
  return route?.query?.deposit;
});
watch(activeDeposit, (newValue, oldValue) => {
  if (newValue == undefined && oldValue) {
    emits("return");
  }
});

const expire_timer = computed(() => {
  const { date_expire, date_now } = getUtcDateNow();

  return (date_expire - date_now) / 1000;
});
const isTimerNotExpired = computed(() => expire_timer.value > 0);

function getUtcDateNow() {
  const formattedUtcDate = correctUtcFormat();

  const date_expire_timestamp = new Date(standardizeDate(state.available_until)).getTime();
  const date_now_timestamp = new Date(formattedUtcDate).getTime();

  return {
    date_expire: date_expire_timestamp,
    date_created: new Date(new Date(standardizeDate(state.available_until)) - 7200000),
    date_now: date_now_timestamp,
  };
}

const timer = ref(0);
const time = ref(null);

function runTimer() {
  if (!state.available_until) {
    return;
  }
  const { date_expire, date_now } = getUtcDateNow();

  if (isTimerNotExpired.value) {
    time.value = new Date(date_expire - date_now).toISOString().slice(11, 19);
  } else {
    clearInterval(timer.value);
    time.value = "00:00:00";
  }
}

runTimer();
timer.value = setInterval(() => {
  runTimer();
}, 1000);
onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss">
.deposit-transaction {
  min-height: 200px;
  &-content {
    &__text {
      font-size: 15px;
      font-weight: 400;
      line-height: 145%;
      color: $color-grey;
      @include media-breakpoint-down("md") {
        margin-top: 20px;
        font-size: 12px;
      }
    }
    &__input-title {
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
      line-height: 145%;
      color: $color-text-dark;
    }
  }
  &-info {
    display: flex;
    margin-top: 60px;
    margin-bottom: 30px;
    font-size: 14px;
    font-weight: 400;
    line-height: 145%;
    @include media-breakpoint-down("md") {
      font-size: 12px;
    }
    &__icon {
      margin-right: 15px;
    }
    &__title {
      font-weight: 700;
    }
  }
  &-footer {
    margin-top: 20px;
    font-size: 15px;
    font-weight: 400;
    line-height: 145%;
    color: $color-grey;
  }
}
</style>
