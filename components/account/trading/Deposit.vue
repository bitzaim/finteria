<template>
  <AppLoader v-if="isLoading || tradingStore.isLoading" class="mt-5" />
  <CardUi in-content v-show="!tradingStore.isLoading && !isLoading">
    <div class="deposit">
      <h4 class="deposit__title" style="margin-top: unset">
        {{ $t(`account.trading.depositFirstPage.chooseDepositAmount`) }}
      </h4>

      <DepositAmount
        v-if="bonusLevels"
        :levels="bonusLevels"
        :is-policy-agreed="state.isBonusPolitics"
        :modelValue="state.amount"
        :error="error"
        @update:modelValue="state.amount = $event"
        @update:policyIsActive="
          state.isBonusPolitics = $event;
          state.isBonusEnabled = $event;
        "
      />

      <h4 class="deposit__title">
        {{ $t(`account.trading.depositFirstPage.chooseFundingMethod`) }}
      </h4>

      <div class="deposit-funding">
        <div class="deposit-funding__item">
          <label class="deposit-funding__item-label">
            <input
              type="radio"
              id="bitcoin"
              name="fundingType"
              value="bitcoin"
              class="deposit-funding__item-input"
              v-model="state.fundingType"
            />
            <div class="deposit-funding__item-title">Bitcoin</div>
            <div class="deposit-funding__item-icons">
              <img :src="`/icons/btc.svg`" width="36" />
            </div>
          </label>
        </div>

        <div class="deposit-funding__item">
          <label class="deposit-funding__item-label">
            <input
              type="radio"
              id="usdt"
              name="fundingType"
              value="usdt"
              class="deposit-funding__item-input"
              v-model="state.fundingType"
            />
            <div class="deposit-funding__item-title">USDT</div>
            <div class="deposit-funding__item-icons">
              <img :src="`/icons/usdt.svg`" width="36" />
            </div>
          </label>
          <div class="deposit-funding__item-right">
            <BaseSelect
              v-if="walletsStore.currencies.length && state.fundingCurrency"
              :selectList="blockchainNetworks"
              :selectedItem="state.usdtNetwork"
              @update:selectedItem="state.usdtNetwork = $event"
              data-value="code"
              data-label="code"
              :border="true"
            />
          </div>
        </div>

        <div
          class="deposit-funding__item"
          v-if="walletsStore.currencies?.find((curr) => curr.code === 'usdc')?.blockchain_networks?.length > 1"
        >
          <label class="deposit-funding__item-label">
            <input
              type="radio"
              id="usdc"
              name="fundingType"
              value="usdc"
              class="deposit-funding__item-input"
              v-model="state.fundingType"
            />
            <div class="deposit-funding__item-title">USDC</div>
            <div class="deposit-funding__item-icons">
              <img :src="`/icons/usdc.svg`" width="36" />
            </div>
          </label>
          <div class="deposit-funding__item-right">
            <BaseSelect
              v-if="walletsStore.currencies.length && state.fundingCurrency"
              :selectList="blockchainNetworks"
              :selectedItem="state.usdcNetwork"
              @update:selectedItem="state.usdcNetwork = $event"
              data-value="code"
              data-label="code"
              :border="true"
            />
          </div>
        </div>

        <div class="deposit-funding__item">
          <label class="deposit-funding__item-label">
            <input
              type="radio"
              id="transfer"
              name="fundingType"
              value="transfer"
              class="deposit-funding__item-input"
              v-model="state.fundingType"
            />
            <div class="deposit-funding__item-title">Crypto</div>
            <div class="deposit-funding__item-icons">
              <img :src="`/icons/eth.svg`" class="me-1 d-none d-lg-block" width="24" />
              <img :src="`/icons/usdc.svg`" class="me-1 d-none d-lg-block" width="24" />
              <img :src="`/icons/dai.svg`" class="me-1 d-none d-lg-block" width="24" />
            </div>
          </label>
          <div class="deposit-funding__item-right">
            <BaseSelect
              v-if="walletsStore.currencies.length && state.fundingCurrency"
              :selectList="filteredCurrencies"
              :selectedItem="state.fundingCurrency"
              @update:selectedItem="state.fundingCurrency = $event"
              data-value="code"
              data-label="code"
              :border="true"
              isIcons
            />
          </div>
        </div>

        <div class="deposit-funding__item" for="card">
          <label class="deposit-funding__item-label">
            <input
              type="radio"
              id="card"
              name="fundingType"
              value="card"
              class="deposit-funding__item-input"
              v-model="state.fundingType"
            />
            <div class="deposit-funding__item-title me-auto" style="min-width: max-content">Visa, Mastercard</div>
            <div class="deposit-funding__item-icons">
              <div class="footer__social" data-v-bb28c0b4="">
                <img src="/img/payment/visa.png" alt="visa" class="me-2" height="14" />
                <img src="/img/payment/mastercard.png" alt="mastercard" height="24" />
              </div>
            </div>
          </label>
        </div>

        <div v-if="isStreamPayAvailable" class="deposit-funding__item">
          <label class="deposit-funding__item-label">
            <input
              type="radio"
              id="streampay"
              name="fundingType"
              value="streampay"
              class="deposit-funding__item-input"
              v-model="state.fundingType"
            />
            <div class="deposit-funding__item-title">Bank Transfer</div>
          </label>
        </div>

        <div v-if="isPayRetailersAvailable" class="deposit-funding__item">
          <label class="deposit-funding__item-label">
            <input
              type="radio"
              id="payretailers"
              name="fundingType"
              value="payretailers"
              class="deposit-funding__item-input"
              v-model="state.fundingType"
              data-click-id="payretailers"
            />
            <div class="deposit-funding__item-title" style="min-width: max-content;">{{ payRetailersLocalName }}</div>
          </label>
        </div>

        <div class="deposit-promocode">
          <span class="link" @click="showPromocodeInput">{{
            $t(`account.trading.depositFirstPage.doYouHavePromocode`)
          }}</span>
          <BaseInput
            id="depositPromocodeAnchor"
            :class="{ invisible: !isPromocodeVisible }"
            v-model="promocode"
            @keypress.enter="applyPromocode"
            small
            class="deposit-promocode__input"
          />
          <BaseButton
            type="button"
            :class="{ invisible: !isPromocodeVisible }"
            mobile-full-width
            @click="applyPromocode"
          >
            {{ $t("common.btns.apply") }}
          </BaseButton>
        </div>
      </div>
      <hr />
      <BaseButton
        type="button"
        @click="onClickDeposit"
        :disabled="!isValid || tradingStore.policyError || isRequesting"
        class="deposit_submit"
        data-click-id="deposit-btn"
      >
        {{ $t(`account.trading.depositFirstPage.depositBtn`) }}
      </BaseButton>

      <BaseModal v-if="isPayRetailersAvailable" v-model="isOpenPayRetailersDialog">
        <form @submit.prevent="onPayRetailersFormSubmit" class="pay-retailers-dialog__form">
          <div
            v-for="[fieldKey, field] in payRetailersFieldsEntries"
            :key="fieldKey"
            class="pay-retailers-dialog__form-item"
            :class="{
              'pay-retailers-dialog__form-item_required': field.required,
            }"
          >
            <BaseLabel :forValue="fieldKey" class="pay-retailers-dialog__form-label">
              {{ field.name }}
            </BaseLabel>

            <VueTelInput
              v-if="fieldKey === 'phone'"
              v-model="payRetailersForm[fieldKey]"
              :id="fieldKey"
              class="pay-retailers-dialog__form-input"
              :class="{ error: !phoneIsValid }"
              :inputOptions="inputOptions"
              :dropdownOptions="dropdownOptions"
              :mode="'international'"
              :validCharactersOnly="true"
              :required="field.required"
              @validate="validateInput"
            />

            <BaseInput
              v-else
              :id="fieldKey"
              :type="field.type"
              v-model="payRetailersForm[fieldKey]"
              class="pay-retailers-dialog__form-input"
              :required="field.required"
              :disabled="field.disabled"
              :placeholder="field.placeholder"
            />
          </div>

          <BaseButton
            class="pay-retailers-dialog__form-submit"
            type="submit"
            :disabled="!isPayRetailersFormValid || !phoneIsValid"
            full-width
          >
            {{ $t(`account.trading.depositFirstPage.depositBtn`) }}
          </BaseButton>
        </form>
      </BaseModal>
    </div>
  </CardUi>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import BaseSelect from "@/components/base/BaseSelect/BaseSelect.vue";
import BaseInput from "@/components/base/BaseInput/BaseInput.vue";
import BaseLabel from "@/components/base/BaseLabel/BaseLabel.vue";
import profile from "@/services/profile";
import DepositAmount from "@/components/account/trading/depositAmount/DepositAmount.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import BaseModal from "@/components/base/BaseModal/BaseModal.vue";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";
import { useToast } from "@/library/vue-toast";
import { useWalletsStore } from "@/stores/userWallets";
import { useTradingStore } from "@/stores/userTradingAccounts";
import { debounce } from "@/utils/debounce";
import { path } from "~~/constants/routes";
import { getMinimumAmount } from "@/utils/constants";
import { useUserStore } from "@/stores/userStore";

const localePath = useLocalePath();
const { t, locale } = useI18n();
const $toast = useToast();
const walletsStore = useWalletsStore();
const tradingStore = useTradingStore();
const emits = defineEmits(["openView"]);
const bonusLevels = ref();
const state = reactive({
  amount: "",
  isBonusEnabled: true,
  isBonusPolitics: true,
  fundingType: "bitcoin",
  fundingCurrency: null,
  fundingCurrencyWallet: null,
  usdtNetwork: null,
  usdcNetwork: null,
});
const isOpenPayRetailersDialog = ref(false);

const userStore = useUserStore();

const isPromocodeVisible = ref(false);
const promocode = ref("");
const gateways = ref();

const getGateways = async () => {
  try {
    gateways.value = await profile.getPaymentGateways(locale.value);
  } catch (err) {
    console.error(err);
  }
};

getGateways();

const isStreamPayAvailable = computed(() => gateways.value?.some((gateway) => gateway.key === "StreamPay"));
const isPayRetailersAvailable = computed(() => gateways.value?.some((gateway) => gateway.key === "PayRetailers"));
const payRetailersGateway = computed(() => gateways.value?.find((gateway) => gateway.key === "PayRetailers"));
const payRetailersLocalName = computed(() => isPayRetailersAvailable.value && payRetailersGateway.value?.name);
const payRetailersFields = computed(() => payRetailersGateway.value?.fields);
const payRetailersFieldsEntries = computed(() => {
  return Object.entries(payRetailersFields.value)?.filter(([_fieldKey, field]) => field.required)
});
const isPayRetailersFormValid = computed(() => {
  return !Object.keys(payRetailersForm).some((key) => {
    return payRetailersFields.value[key].required && !payRetailersForm[key];
  });
});

const payRetailersForm = reactive({});

watch(payRetailersFields, (newValue) => {
  if (!payRetailersFields['phone']?.required) {
    phoneIsValid.value = true
  }

  Object.entries(newValue).forEach(([fieldKey, field]) => {
    payRetailersForm[fieldKey] = field.value;
  });
});

const phoneIsValid = ref(false);

const dropdownOptions = {
  showDialCodeInList: true,
  showFlags: true,
  showSearchBox: true,
};

const inputOptions = {
  inputOptions: "on",
  showDialCode: true,
  autofocus: false,
  type: "tel",
};

const validateInput = (event) => {
  phoneIsValid.value = event.valid;
};

async function applyPromocode() {
  if (!promocode.value) return;
  try {
    const res = await profile.applyPromocode(promocode.value);
    if (res.data?.length) {
      res.data.forEach((gift) => {
        $toast.gift(gift.message, { position: "top-right", queue: true });
      });
      const { data } = await profile.getBonusLevels(tradingStore.account.currency);
      bonusLevels.value = roundUpLevels(data);
      state.amount = userStore.minFirstAmount;
    } else {
      $toast.success(t("signUp.promoCodeApplied").replace("XXX", promocode.value), { position: "top-right" });
    }
    await createInvoice();
  } catch (error) {
    $toast.warning(error?.response?._data?.message || t("signUp.wrongPromoCode"), { position: "top-right" });
  } finally {
    promocode.value = "";
    isPromocodeVisible.value = false;
  }
}

function showPromocodeInput(e) {
  isPromocodeVisible.value = !isPromocodeVisible.value;
  const input = document.querySelector("#depositPromocodeAnchor > input");

  setTimeout(() => {
    input.focus();
  });
}
const error = computed(() => {
  if (!bonusLevels.value) {
    return false;
  }

  if (+state.amount >= userStore.minAmount) {
    return false;
  } else {
    return `Minimum ${userStore.minAmount}`;
  }
});
const isValid = ref(true);
const isRequesting = ref(false);

const EXCEPTION_CURRENCIES = ["btc", "usdt"];
// adding usdc to exceptions if it has 2 blockhain_networks
const usdc = walletsStore.currencies.find((cur) => cur.code === "usdc");
if (usdc && usdc.blockchain_networks?.length > 1) {
  EXCEPTION_CURRENCIES.push("usdc");
}
const filteredCurrencies = computed(() =>
  walletsStore.currencies.filter((item) => item.is_crypto && !EXCEPTION_CURRENCIES.includes(item.code))
);
const blockchainNetworks = [
  { id: 0, code: "trc20" },
  { id: 1, code: "erc20" },
];
async function createInvoice() {
  if (state.amount && state.fundingCurrency && state.amount[state.amount.length - 1] !== ".") {
    try {
      isValid.value = true;
      const { data } = await profile.createDepositInvoice(transformRequestProperties(state, tradingStore?.account?.id));
      tradingStore.SET_INVOICE(data);
    } catch (e) {
      isValid.value = false;
      $toast.warning(e?.response?._data?.message, { position: "top-right" });
    } finally {
      tradingStore.SET_FETCHING(false);
    }
  }
}

async function init() {
  if (tradingStore.account?.open_trader_invoice) {
    try {
      await profile.cancelDepositInvoice(tradingStore.account.open_trader_invoice.id);
    } catch (e) {
      $toast.warning(e?.response?._data?.message, { position: "top-right" });
    }
  }
  tradingStore.SET_FETCHING(true);
  tradingStore.SET_POLICY_ERROR("");
  tradingStore.SET_INVOICE({});
  tradingStore.SET_EXECUTED_INVOICE({});
  await walletsStore.FETCH_WALLETS();
  if (!walletsStore.currencies?.length > 0) {
    await walletsStore.FETCH_CURRENCIES();
  }
  if (tradingStore.account?.currency) {
    const { data } = await profile.getBonusLevels(tradingStore.account.currency);
    const roundedUp = roundUpLevels(data);
    bonusLevels.value = roundedUp;
    state.amount = userStore.minFirstAmount
  }
  state.fundingCurrencyWallet = walletsStore.getUserCurrencies[0];
  state.fundingCurrency = filteredCurrencies.value[0];
  await createInvoice();
  isLoading.value = false;
}

function roundUpLevels(bonusLevels) {
  let visual_divisibility = walletsStore.getCurrencyVisualDivisibility(bonusLevels?.[0].display_currency);
  let exponent = 10 ** (visual_divisibility || 6);
  let roundedUp = bonusLevels?.map((obj) => {
    if (obj?.level % 1 !== 0) {
      obj.level = Math.ceil(obj.level * exponent) / exponent;
      return obj;
    }
    return obj;
  });
  // performing descending sort for spare case
  roundedUp.sort(function (a, b) {
    return b.level - a.level;
  });
  return roundedUp;
}

function checkPrivacy() {
  tradingStore.SET_POLICY_ERROR(state.isBonusEnabled && !state.isBonusPolitics ? "required" : "");
}

async function cancelInvoice() {
  try {
    await profile.cancelDepositInvoice(tradingStore.executedInvoive.id);
    tradingStore.SET_ACCOUNT({});
    tradingStore.SET_INVOICE({});
    tradingStore.SET_EXECUTED_INVOICE({});
    tradingStore.SET_POLICY_ERROR("");
  } catch (e) {
    $toast.error(e?.response?._data?.message, { position: "top-right" });
  }
}

function onClickDeposit() {
  if (state.fundingType === "payretailers") {
    isOpenPayRetailersDialog.value = true;
  } else {
    executeInvioce();
  }
}

async function executeInvioce() {
  checkPrivacy();
  if (!tradingStore.policyError) {
    if (tradingStore.executedInvoive.id) {
      cancelInvoice();
    }

    try {
      isRequesting.value = true;
      await createInvoice();

      if (isValid.value) {
        const res = await profile.executeDepositInvoice({ quote_id: tradingStore.invoice.id });
        tradingStore.SET_EXECUTED_INVOICE(res.data);

        if (state.fundingType === "wallet") navigateTo({ path: localePath("/profile/trading/success"), replace: true });
        else if (state.fundingType === "card") navigateTo({ path: localePath(path.account.trading), replace: true });
        else if (["streampay", "payretailers"].includes(state.fundingType)) {
          const payUrl = res.data.payment_invoice.pay_url;
          isOpenPayRetailersDialog.value = false;
          navigateTo(payUrl, { external: true });
        } else navigateTo({ path: localePath(`/profile/trading/address`), replace: true });
      }
    } catch (e) {
      $toast.warning(e.response._data.message, { position: "top-right" });
    } finally {
      isRequesting.value = false;
    }
  }
}

const isLoading = ref(true);
onMounted(() => {
  state.usdtNetwork = blockchainNetworks[0];
  state.usdcNetwork = blockchainNetworks[0];

  init();
});

const debounceCreateInvoice = debounce(() => createInvoice());

watch(
  () => state.fundingType,
  (fundingType) => {
    if (fundingType === "card") {
      const minimumAmount = getMinimumAmount(tradingStore.invoice.display_currency);
      if (state.amount < minimumAmount) {
        state.amount = +minimumAmount;
      }
    }

    if (fundingType !== "streampay" && fundingType !== "payretailers") {
      debounceCreateInvoice();
    }
  }
);
watch(
  () => state.amount,
  (amount) => {
    if (amount && !isLoading.value) {
      debounceCreateInvoice();
    }
  }
);
watch([() => state.usdtNetwork, () => state.usdcNetwork], () => {
  if ((state.fundingType == "usdt" || state.fundingType == "usdc") && !isLoading.value) {
    debounceCreateInvoice();
  }
});
watch(
  () => state.fundingCurrency,
  () => {
    if (state.fundingType == "transfer") {
      debounceCreateInvoice();
    }
  }
);
watch(
  () => state.isBonusEnabled,
  () => {
    checkPrivacy();
    debounceCreateInvoice();
  }
);
watch(
  () => state.isBonusPolitics,
  () => checkPrivacy()
);

const fundingSource = computed(() => {
  switch (state.fundingType) {
    case "card":
      return "card";
    case "streampay":
    case "payretailers":
      return "payment_gateway";
    default:
      return "crypto";
  }
});

function transformRequestProperties(state, accountID) {
  const requestData = {
    trader_account_id: accountID,
    amount: String(state.amount),
    with_bonus: state.isBonusEnabled ? 1 : 0,
    funding_method: state.fundingType === "wallet" ? "wallet" : "transfer",
  };

  const cardCurrency = walletsStore.currencies.find((cur) => cur.code === tradingStore.account.currency);

  const funding_currencies_methods = {
    bitcoin: "btc",
    usdt: "usdt",
    usdc: "usdc",
    transfer: state.fundingCurrency?.code,
    wallet: state.fundingCurrencyWallet?.code,
    card: cardCurrency.is_crypto ? cardCurrency.code : "usdt",
  };
  if (state.fundingType === "usdt") {
    requestData.blockchain_network = state.usdtNetwork.code;
  }
  if (state.fundingType === "usdc") {
    requestData.blockchain_network = state.usdcNetwork.code;
  }
  if (state.fundingType === "transfer" && state.fundingCurrency.blockchain_networks?.[0]) {
    requestData.blockchain_network = state.fundingCurrency.blockchain_networks[0];
  }
  if (state.fundingType !== "wallet") {
    requestData.funding_source = fundingSource.value;
  }
  // LOGIC: for card eth deposits i manually set 'erc20' as blockchain_network
  if (state.fundingType === "card" && tradingStore.account.currency === "eth") {
    requestData.blockchain_network = "erc20";
  } else if (state.fundingType === "card" && !cardCurrency?.is_crypto) {
    requestData.blockchain_network = "trc20";
  }

  if (state.fundingType === "streampay") {
    requestData.payment_gateway_id = 1;
  } else if (state.fundingType === "payretailers") {
    requestData.payment_gateway_id = 2;
    requestData.fields = { ...state.payRetailersFields };
  }

  return { ...requestData, funding_currency: funding_currencies_methods[state.fundingType] };
}

const onPayRetailersFormSubmit = async () => {
  if (isPayRetailersFormValid.value) {
    state.payRetailersFields = {};

    payRetailersFieldsEntries.value?.forEach(([fieldKey, field]) => {
      if (!field.display_only) {
        state.payRetailersFields[fieldKey] =
          fieldKey === "phone" ? payRetailersForm[fieldKey].replaceAll(" ", "") : payRetailersForm[fieldKey];
      }
    });

    executeInvioce();
  } else {
    $toast.warning(t("account.trading.depositFirstPage.payretailers.fillRequiredFields"), { position: "top-right" });
  }
};
</script>

<style lang="scss">
.deposit {
  padding-left: 46px;
  @include media-breakpoint-down("md") {
    padding-left: 0;
  }
  &__title {
    position: relative;
    margin-top: 45px;
    margin-bottom: 30px;
    @include media-breakpoint-down("md") {
      margin-bottom: 35px;
    }
    &:before {
      position: absolute;
      top: 50%;
      left: -46px;
      display: inline-block;
      width: 36px;
      height: 36px;
      font-size: 14px;
      font-weight: 700;
      line-height: 33px;
      text-align: center;
      content: "1";
      border: 2px solid $color-orange-dark;
      border-radius: 50%;
      transform: translate(0, -50%);
      @include media-breakpoint-down("md") {
        position: static;
        top: auto;
        left: auto;
        margin-right: 10px;
        transform: translate(0, 0);
      }
    }
    &:last-of-type {
      &:before {
        content: "2";
      }
    }
  }
  &-btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    &__item {
      display: flex;
      flex-basis: calc(33.33% - 8px);
      flex-grow: 1;
      flex-shrink: 1;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      font-size: 15px;
      font-weight: 400;
      line-height: 150%;
      color: $color-grey;
      background: $color-disable;
      border: 0;
      border-radius: 4px;
      @include media-breakpoint-down("md") {
        padding: 6px 0;
        font-size: 12px;
      }
      &--active {
        position: relative;
        color: $color-white;
        &:before {
          position: absolute;
          bottom: 100%;
          left: 50%;
          width: 12px;
          height: 6px;
          content: "";
          background-image: url("/img/account/bonus-btn-corner.svg");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
      }
      & .icon {
        margin-right: 7px;
        @include media-breakpoint-down("md") {
          display: none;
          width: 18px !important;
          height: 18px !important;
        }
        & svg {
          @include media-breakpoint-down("md") {
            width: 18px;
            height: 18px;
          }
        }
      }
      &:nth-of-type(2) {
        margin: 0 4px;
      }
    }
    &__bonus {
      font-size: 18px;
      font-weight: 500;
      line-height: 125%;
      color: $color-text-dark;
      @include media-breakpoint-down("md") {
        font-size: 14px;
      }
    }
  }
  &__politics {
    margin-top: 20px;
  }
  &-total {
    margin-top: 20px;
    margin-bottom: 30px;
    &__text {
      font-size: 18px;
      font-weight: 500;
      line-height: 145%;
      color: $color-grey;
      @include media-breakpoint-down("md") {
        font-size: 14px;
      }
    }
    &__amount {
      @include media-breakpoint-down("md") {
        font-size: 16px;
      }
    }
  }
  &-funding {
    max-width: 500px;

    &__item {
      position: relative;
      display: flex;
      align-items: center;
      height: 60px;
      padding: 10px 10px 10px 20px;
      margin-bottom: 5px;
      cursor: pointer;
      background: $color-disable;
      border-radius: 4px;
      @include media-breakpoint-down("md") {
        flex-direction: row;
        padding: 15px 10px;
        margin-bottom: 10px;
      }
      &-title {
        flex-basis: 140px;
        flex-shrink: 1;
        font-size: 18px;
        font-weight: 500;
        line-height: 145%;
        color: $color-grey;
        text-align: left;
        @include media-breakpoint-down("md") {
          flex-basis: 108px;
          margin: 0;
          font-size: 14px;
        }
      }
      &-input {
        position: relative;
        margin-right: 12px;
        @include media-breakpoint-down("sm") {
          margin-right: 7px;
        }
      }
      &-icons {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
      }
      &-right {
        position: relative;
        display: flex;
        flex-basis: 30%;
        flex-shrink: 0;
        justify-content: flex-end;
        margin-left: auto;
      }
      & .component-container {
        @include media-breakpoint-down("md") {
          margin-left: auto;
        }
      }
      &-label {
        display: flex;
        flex-grow: 1;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  &-promocode {
    display: flex;
    gap: 10px;
    align-items: center;
    padding-top: 15px;
    &__input {
      width: 150px;
    }
    button {
      max-width: 120px;
    }
    .link {
      color: $color-link;
      cursor: pointer;
      @include media-breakpoint-down("md") {
        font-size: 14px;
      }
      @include media-breakpoint-down("sm") {
        width: 100%;
      }
    }
    .link:hover {
      color: $color-link-hover;
    }

    @include media-breakpoint-down("sm") {
      flex-wrap: wrap;
    }
  }
}

.pay-retailers-dialog__form-item_required .pay-retailers-dialog__form-label::after {
  margin-left: 5px;
  color: $color-danger;
  content: "*";
}

.pay-retailers-dialog__form-item_required .pay-retailers-dialog__form-label {
  justify-content: flex-start;
}

.pay-retailers-dialog__form-item:not(:last-child) {
  margin-bottom: 10px;

  @include media-breakpoint-up("md") {
    margin-bottom: 15px;
  }

  @include media-breakpoint-up("xl") {
    margin-bottom: 20px;
  }
}

.error {
  border: 1px solid red;
}
</style>
