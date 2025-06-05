<template>
  <AccountWrap>
    <AccountWrapSubPage
      :label="$t(`account.nav.loans`)"
      with-go-back
      @go-back="navigateTo(localePath(path.account.loans.list))"
    >
      <AppLoader v-if="!isReady" class="mt-5" />

      <div v-else class="loan">
        <div class="loan__left">
          <CardUi in-content class="pt-0">
            <div class="row align-items-center">
              <div class="col">
                <div class="loan__left-id">#{{ userLoans.activeLoan.id }}</div>
              </div>
              <div class="col-auto">
                <div class="loan__left-status" :class="{ closed: userLoans.activeLoan?.status === 'closed' }">
                  {{ userLoans.activeLoan.status }}
                </div>
              </div>
            </div>

            <LoanPageTable :rows="rows" />
            <hr />
            <b>LTV Liquidation Threshold</b>
            <LoanPageTable :rows="rowsLtv" />
            <hr />

            <!-- <LoanPageTable :rows="rows2" />
            <hr> -->
            <p>Download Loan Agreement</p>
          </CardUi>
        </div>
        <div class="loan__right">
          <CardUi in-content class="pt-0">
            <b>Original Collateral</b>
            <LoanPageTable :rows="rowsCollateralOriginal" />
            <hr />

            <b>Current Collateral</b>
            <LoanPageTable :rows="rowsCollateralCurrent" />
            <hr />
          </CardUi>
        </div>
      </div>
      <div class="loan-change" v-if="userLoans.activeLoan?.status === 'opened'">
        <CardUi in-content class="pt-0">
          <div class="loan-change__add">
            <BaseButton type="button" @click="operationType === 'add' ? makeOperation() : showOperation('add')">
              Add More Collateral
            </BaseButton>
            <div class="loan-change__action" v-if="operationType === 'add'">
              <BaseInput
                @update:modelValue="input = $event"
                :modelValue="input"
                small
                :disabled="false"
                text-right
                type="number"
                max-float="8"
                :max="inputMax"
              />
              <div class="col-auto ps-0">
                <img
                  :src="`/icons/${userLoans.activeLoan?.collateral_currency?.code}.svg`"
                  class="loan-bottom__input-img"
                  :alt="userLoans.activeLoan?.collateral_currency?.display_code"
                />
                {{ userLoans.activeLoan?.collateral_currency?.display_code?.toUpperCase() }}
              </div>

              <BaseButton color="secondary" type="button" @click="clearOperation">
                {{ $t("common.btns.cancel") }}
              </BaseButton>
            </div>
          </div>

          <div class="loan-change__withdraw">
            <BaseButton
              color="tertiary"
              type="button"
              @click="operationType === 'withdraw' ? makeOperation() : showOperation('withdraw')"
            >
              Withdraw Collateral
            </BaseButton>

            <div class="loan-change__action" v-if="operationType === 'withdraw'">
              <BaseInput
                @update:modelValue="input = $event"
                :modelValue="input"
                small
                :disabled="false"
                text-right
                type="number"
                max-float="8"
                :max="inputMax"
              />
              <div class="col-auto ps-0">
                <img
                  :src="`/icons/${userLoans.activeLoan?.collateral_currency?.code}.svg`"
                  class="loan-bottom__input-img"
                  :alt="userLoans.activeLoan?.collateral_currency?.display_code"
                />
                {{ userLoans.activeLoan?.collateral_currency?.display_code?.toUpperCase() }}
              </div>

              <BaseButton color="tertiary" type="button" @click="clearOperation">
                {{ $t("common.btns.cancel") }}
              </BaseButton>
            </div>
          </div>
        </CardUi>
      </div>
    </AccountWrapSubPage>
  </AccountWrap>
</template>

<script setup>
import AccountWrap from "@/components/account/AccountWrap.vue";
import AccountWrapSubPage from "@/components/account/AccountWrapSubPage.vue";
import AppLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput/BaseInput.vue";
import LoanPageTable from "@/components/account/loans/LoanPageTable";
import profile from "@/services/profile";
import { computed, ref, reactive } from "vue";
import { useToast } from "@/library/vue-toast";
import { useWalletsStore } from "@/stores/userWallets";
import { path } from "@/constants/routes";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

import { useLoansStore } from "@/stores/userLoans";
const { t } = useI18n();
const userLoans = useLoansStore();
const localePath = useLocalePath();
const walletsStore = useWalletsStore();
const route = useRoute();
const $toast = useToast();
const isReady = ref(false);

const maxMoreCollateral = computed(
  () =>
    walletsStore.wallets.find((item) => item.currency.code === userLoans.activeLoan.collateral_currency.code)?.balance
);

const rows = ref([]);
const rows2 = ref([]);
const rowsCollateralOriginal = ref([]);
const rowsCollateralCurrent = ref([]);
const rowsLtv = ref([]);

const operationType = ref(null);
const input = ref(null);
const inputMax = ref(null);

async function getLoan() {
  try {
    if (!userLoans.activeLoan) {
      await userLoans.FETCH_LOAN(route.query.id);
    }
  } catch (e) {
    $toast.warning(e?.response?._data?.message, { position: "top-right" });
  }
}

function setRows() {
  rows.value = [
    { label: "Loan Amount", field: "initial_loan_amount_view" },
    // {label: "Interest Rate", field: "interest_rate" },
    { label: "Daily Interest rate", field: "daily_rate_view" },
    { label: "Daily Interest", field: "daily_interest_view" }, // comp
    { label: "Final Payment", field: "final_payment" },
    { label: "Origination Date", field: "created_at_view" },
  ];
  rows2.value = [{ label: "Next Payment Amount", field: "daily_rate" }];
  rowsCollateralOriginal.value = [
    { label: "Collateral Amount", field: "initial_collateral_amount_view" },
    { label: "Collateral Value", field: "initial_collateral_value" }, // initial_collateral_amount * курс
    {
      label: `${userLoans.activeLoan?.collateral_currency?.code?.toUpperCase()}/${userLoans.activeLoan?.loan_currency?.code?.toUpperCase()} Rate`,
      field: "rate",
    }, // курс
    { label: "LTV", field: "initial_ltv_view" },
  ];
  rowsCollateralCurrent.value = [
    { label: "Collateral Value", field: "collateral_value" }, // collateral_amount * курс
    { label: "Collateral Amount", field: "collateral_amount_view" },
    {
      label: `${userLoans.activeLoan?.collateral_currency?.code?.toUpperCase()}/${userLoans.activeLoan?.loan_currency?.code?.toUpperCase()} Rate`,
      field: "rate",
    }, // курс
    { label: "LTV", field: "ltv_view" },
  ];
  rowsLtv.value = [
    { label: "Liquidation Price", field: "ltv_liquidation_price" },
    { label: "Liquidation LTV", field: "ltv_liquidation_threshold_view" },
  ];
}

const operations = reactive({
  add: {
    title: "Add More Collateral",
    func: profile.makeLoanDeposit,
  },
  withdraw: {
    title: "Withdraw Collateral",
    func: profile.makeLoanWithdraw,
  },
});

function clearOperation() {
  input.value = null;
  operationType.value = null;
}

function showOperation(type) {
  inputMax.value = type === "add" ? maxMoreCollateral.value : userLoans.activeLoan?.collateral_available_to_withdraw;
  operationType.value = type;
}

async function makeOperation() {
  const type = operationType.value;
  try {
    const { data } = await operations[type].func(route.query.id, { amount: input.value });
    userLoans.SET_ACTIVE_LOAN(data);
    $toast.success(t("common.btns.done"), { position: "top-right" });
    clearOperation();
  } catch (e) {
    $toast.warning(e.response?._data?.message, { position: "top-right" });
  }
}

async function init() {
  await getLoan();
  await walletsStore.FETCH_WALLETS();
  setRows();
  isReady.value = true;
}

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.loan {
  display: flex;
  flex-wrap: wrap;
}

.loan__left {
  flex-grow: 1;
  font-size: 16px;
  font-weight: 400;
  line-height: 145%;
  & .row {
    margin-bottom: 15px;
  }
}
.loan__left-id {
  font-size: 24px;
  font-weight: 400;
  line-height: 140%;
}

.loan__left-status {
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  color: $color-green-light;
  text-transform: capitalize;

  &:before {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    content: "";
    background: $color-green-light;
    border-radius: 10px;
  }

  &.closed {
    color: orange;

    &::before {
      background: orange;
    }
  }
}

.loan__right {
  flex-grow: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  & .row {
    margin-bottom: 15px;
  }
}

.loan__right b,
.loan__left b {
  display: inline-block;
  margin-bottom: 15px;
}

.loan-bottom {
  display: flex;
  gap: 15px;
}

.loan-bottom__input {
  flex-shrink: 0;
  width: 40%;
  margin-right: 30px;
}

.loan-bottom__input-img {
  flex-shrink: 1;
  width: 20px;
  height: 20px;
}

.loan-change {
  &__add {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    & button {
      margin: 10px 0;
      margin-right: 5px;
    }
  }

  &__withdraw {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    & button {
      margin: 10px 0;
      margin-right: 5px;
    }
  }

  &__action {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
