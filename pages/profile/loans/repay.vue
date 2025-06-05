<template>
  <AccountWrap>
    <AppLoader v-if="!isReady" class="mt-5" />

    <AccountWrapSubPage
      v-else
      :label="`Loan #` + userLoans.activeLoan?.id"
      with-go-back
      @go-back="navigateTo(localePath(path.account.loans.list))"
    >
      <div class="repay-header">
        <div class="">Loan Amount: 100 EUR</div>
        <div class="">Daily Interest: 9.12 EUR</div>
        <div class="">Remaining Principal: 100 EUR</div>
      </div>

      <CardUi in-content>
        <div class="repay">
          <p class="repay-notice">
            Please choose the way how you would like to repay your loan. You can make a regular payment according to
            schedule, or you can make a full early repayment.
          </p>
          <div class="repay-type">
            <div class="repay-type__item">
              <div class="repay-type__item-title">I want to make partial payment</div>
              <div class="repay-type__item-body">
                <div class="repay-type__item-input">
                  <BaseInput v-model="inputPartial" small placeholder="Amount" type="number" max-float="8" />
                </div>
                <BaseButton type="button" full-width class="repay-type__item-btn">Pay 0.83 EUR</BaseButton>
              </div>
            </div>
            <div class="repay-type__item">
              <div class="repay-type__item-title">I want to pay loan in full</div>
              <div class="repay-type__item-body">
                <BaseButton type="button" full-width class="repay-type__item-btn">Pay 100 EUR</BaseButton>
              </div>
            </div>
          </div>
          <div class="repay-currency">
            <div class="repay-currency__item">
              <div class="">
                <div class="repay-currency__item-title">Loan Currency</div>
                <div class="repay-currency__item-text">Pay in loan currency</div>
              </div>

              <BaseButton type="button" color="secondary" full-width class="repay-currency__item-btn">
                Pay 100 EUR
              </BaseButton>
            </div>
            <div class="repay-currency__item">
              <div class="">
                <div class="repay-currency__item-title">Use Loan Collateral</div>
                <div class="repay-currency__item-text">This will increase the LTV of your loan</div>
              </div>
              <BaseButton type="button" color="secondary" full-width class="repay-currency__item-btn">
                Pay 0.0030078 BTC
              </BaseButton>
            </div>
            <div class="repay-currency__item">
              <div>
                <div class="repay-currency__item-title">Other Asset</div>
                <div class="repay-currency__item-text">Pay in other available assets</div>
              </div>

              <Select
                :selectList="walletsStore.getUserCurrencies"
                :selectedItem="currency"
                :border="true"
                @update:selectedItem="currency = $event"
                isIcons
                with-balance
              />

              <BaseButton type="button" color="secondary" full-width class="repay-currency__item-btn">
                Pay 400 XRP
              </BaseButton>
            </div>
          </div>
          <div class="repay-sum">
            <div class="repay-sum__title">Repayment Summary</div>
            <div class="row">
              <div class="col">
                <div class="row">
                  <div class="col">Due Date</div>
                  <div class="col-auto">Sep 24, 2021</div>
                </div>
                <div class="row">
                  <div class="col">Principal Amount</div>
                  <div class="col-auto">O EUR</div>
                </div>
                <div class="row">
                  <div class="col">Interest</div>
                  <div class="col-auto">0.83 EUR</div>
                </div>
                <div class="row">
                  <div class="col">Total Amount</div>
                  <div class="col-auto">0.83 EUR</div>
                </div>
              </div>
              <div class="col-1"></div>
              <div class="col">
                <div class="row">
                  <div class="col">BTC/EUR Rate</div>
                  <div class="col-auto">33,677.8 EUR</div>
                </div>
                <div class="row">
                  <div class="col">Collateral Amount</div>
                  <div class="col-auto">0.00002524 ВTC</div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <BaseButton class="mt-3" type="button">{{ $t("common.btns.confirm") }}</BaseButton>
        </div>
      </CardUi>
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
import Select from "@/components/base/BaseSelect/BaseSelect.vue";
import { useToast } from "@/library/vue-toast";
import { useWalletsStore } from "@/stores/userWallets";
import { path } from "@/constants/routes";
import { ref } from "vue";
import { useLoansStore } from "@/stores/userLoans";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})

const userLoans = useLoansStore();
const localePath = useLocalePath();

const walletsStore = useWalletsStore();
const $toast = useToast();
const route = useRoute();
const isReady = ref(false);
const inputPartial = ref(null);
const currency = ref(null);

async function getLoan() {
  try {
    if (!userLoans.activeLoan) {
      await userLoans.FETCH_LOAN(route.query.id);
    }
  } catch (e) {
    $toast.warning(e?.response?._data?.message, { position: "top-right" });
  } finally {
    isReady.value = true;
  }
}

async function init() {
  await getLoan();
  await walletsStore.FETCH_WALLETS();
  await walletsStore.FETCH_CURRENCIES();
  currency.value = walletsStore.currencies[0];
}

init();
</script>

<style scoped lang="scss">
.repay-header {
  display: flex;
  gap: 38px;
  padding: 18px 30px 22px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  background: $color-bg-grey;
}

.repay-notice {
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
}

.repay-type {
  display: flex;
  gap: 20px;
  margin: 30px 0 20px;
}
.repay-type__item {
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 30px 40px;
  border: 1px solid $color-disable-light;
}

.repay-type__item-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 400;
  line-height: 140%;
  text-align: center;
}

.repay-type__item-body {
  display: flex;
  justify-content: center;
}

.repay-type__item-input {
  flex-shrink: 1;
  width: 100px;
  margin-right: 10px;
}

button.repay-type__item-btn {
  width: 243px;
}

.repay-currency {
  display: flex;
  gap: 20px;
}

.repay-currency__item {
  display: flex;
  flex-basis: 0;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  padding: 30px;
  background: $color-primary-light-trade;
}

.repay-currency__item-title {
  font-size: 24px;
  font-weight: 400;
  line-height: 140%;
  text-align: center;
}

.repay-currency__item-text {
  margin-bottom: 35px;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  text-align: center;
}

.repay-currency__item-btn {
  margin-top: 10px;
}

.repay-sum {
  margin-bottom: 30px;
}

.repay-sum__title {
  margin: 30px 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
}
</style>
