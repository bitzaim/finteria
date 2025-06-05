<template>
  <BaseModal v-model="isOpen" prevent-click-outside class="paybis">
    <h2 class="paybis__title">
      {{ $t("account.trading.depositWithModal.title") }}
    </h2>

    <p class="paybis__text">
      {{ $t("account.trading.depositWithModal.paybis.text") }}
    </p>

    <ol class="paybis__list">
      <li class="paybis__item">
        <p class="paybis__text paybis__list-text">
          {{ $t("account.trading.depositWithModal.paybis.addressText") }}
        </p>

        <label class="paybis__label" for="address">
          {{ $t("account.trading.depositWithModal.paybis.walletAddress") }}
        </label>

        <BaseInput class="paybis__input" :modelValue="tradingDepositAddress" id="address" small readonly copy />
      </li>

      <li class="paybis__item">
        <p class="paybis__text paybis__list-text">
          {{ $t("account.trading.depositWithModal.paybis.clickButtonText") }}
        </p>
      </li>
    </ol>

    <div class="paybis__info">
      <BaseButton
        class="paybis__deposit-with"
        link
        color="primary"
        size="big"
        :href="paybisUrl"
        target="_blank"
        rel="nofollow noopener"
      >
        {{
          $t("account.trading.depositWithModal.paybis.depositWith", {
            a$mnt: `${tradingDepositAmount} ${tradingDepositCurrency?.toUpperCase()}`,
          })
        }}
      </BaseButton>
    </div>

    <p class="paybis__text">
      {{ $t("account.trading.depositWithModal.paybis.afterText") }}
    </p>

    <DepositTransactionTimer class="paybis__timer" @cancel="onDepositCancel" />

    <div class="paybis__bottom-info">
      <div>
        {{ $t("account.trading.depositSecondPage.needAssistance") }}
        <button class="paybis__link" @click="requestCallback">
          {{ $t("account.trading.depositSecondPage.requestCallback") }}
        </button>
        {{ $t("account.trading.depositSecondPage.or") }}
        <button class="paybis__link" @click="openChat">
          {{ $t("account.trading.depositSecondPage.chatWithUs") }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "@/components/base/BaseModal/BaseModal.vue";
import BaseInput from "@/components/base/BaseInput/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import DepositTransactionTimer from "./DepositTransactionTimer.vue";
import { useToast } from "@/library/vue-toast";
import { useUserStore } from "@/stores/userStore";
import { useTradingStore } from "@/stores/userTradingAccounts";
import { useWebsockets } from "@/composition/useWebsockets";
import { deepEqual } from "@/utils/utilsObjects";
import profile from "@/services/profile";
import { useTradeConstants } from "~/constants/trade";

type Props = {
  modelValue: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "cancel"]);
const toast = useToast();
const userStore = useUserStore();
const tradingStore = useTradingStore();
const { currencyCodesFrom } = useTradeConstants();

useWebsockets([
  {
    name: ".TraderInvoiceUpdated",
    callback: (e) => {
      updateTradingInvoice(e.model);
    },
  },
]);

const updateTradingInvoice = (newInvoice: any) => {
  console.log("function starts", newInvoice);
  if (newInvoice.id !== tradingStore.executedInvoive?.id) {
    console.log("another invoice updated", newInvoice.id);
    return;
  }
  if (deepEqual(newInvoice, tradingStore.executedInvoive)) {
    console.log("isEqual");
    return;
  } else {
    console.log("updated");
    tradingStore.SET_EXECUTED_INVOICE(newInvoice);
  }
};

const tradingDepositAmount = computed(() => {
  return tradingStore.executedInvoive.deposit_amount || null;
});

const tradingDepositAddress = computed(() => {
  return tradingStore.executedInvoive.receive_address?.address || null;
});

const tradingDepositCurrency = computed(() => {
  return tradingStore.executedInvoive.funding_currency || null;
});

const isOpen = computed<boolean>({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const requestCallback = () => {
  const phone = userStore.user?.phone_number;
  const apiResult = jivo_api?.startCall(phone);

  if (apiResult?.result === "ok") {
    console.log("Call started, phone: ", phone);
  } else {
    console.log("Failed to start the call, reason: ", apiResult.reason);
  }
};

const openChat = () => {
  jivo_api?.open();
};

const onDepositCancel = async () => {
  const invoiceId = tradingStore.executedInvoive.id;
  try {
    await profile.cancelDepositInvoice(invoiceId);
    tradingStore.SET_ACCOUNT({});
    tradingStore.SET_INVOICE({});
    tradingStore.SET_EXECUTED_INVOICE({});
    emit("cancel", invoiceId);
  } catch (e) {
    toast.error(e?.response?._data?.message, { position: "top-right" });
  }
};

const paybisUrl = computed<string>(() => {
  const url = new URL("https://onramp.paybis.com/");

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currencyCodeFrom = currencyCodesFrom[timeZone] || "USD";
  const currencyCodeTo =
    tradingDepositCurrency.value === "usdt" ? "USDT-TRC20" : tradingDepositCurrency.value?.toUpperCase();

  url.searchParams.append("currencyCodeTo", currencyCodeTo);
  url.searchParams.append("currencyCodeFrom", currencyCodeFrom);
  url.searchParams.append("cryptoAddress", tradingDepositAddress.value);
  url.searchParams.append("amountTo", tradingDepositAmount.value);

  return url.toString();
});
</script>

<style scoped lang="scss">
.paybis__title {
  margin-bottom: 5px;
  font-size: 16px;

  @include media-breakpoint-up("sm") {
    font-size: 20px;
  }

  @include media-breakpoint-up("md") {
    margin-bottom: 10px;
    font-size: 36px;
  }
}

.paybis__text {
  margin-bottom: 10px;
  font-size: 14px;
  white-space: pre-wrap;

  @include media-breakpoint-up("md") {
    margin-bottom: 15px;
    font-size: 18px;
  }
}

.paybis__label {
  grid-column: 1 / 3;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  line-height: 145%;
  color: $color-text-dark;
}

.paybis__link {
  color: $color-link;
  cursor: pointer;

  &:hover {
    color: $color-link-hover;
  }
}

.paybis__info {
  margin-top: 40px;
  margin-bottom: 20px;
  text-align: center;
}

.paybis__deposit-with {
  padding-right: 52px;
  padding-left: 52px;
  color: $color-text-dark;
  text-transform: none;
  letter-spacing: 0;
}

.paybis__timer {
  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }
}

.paybis__list {
  padding: 0;
  list-style: none;
  counter-reset: paybis-counter;
}

.paybis__item {
  display: grid;
  grid-template-columns: 30px 1fr;
  column-gap: 10px;
  counter-increment: paybis-counter;
}

.paybis__item:before {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  content: counter(paybis-counter);
  border: 2px solid $color-orange-dark;
  border-radius: 50%;
}

.paybis__item:not(:last-child) {
  margin-bottom: 20px;
}

.paybis__input {
  grid-column: 1 / 3;
}

.paybis__list-text {
  margin: 0;
}

.paybis__bottom-info {
  margin-top: 20px;

  @include media-breakpoint-up("md") {
    margin-top: 40px;
  }
}
</style>
