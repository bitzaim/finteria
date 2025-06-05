import { defineStore } from "pinia";
import profile from "@/services/profile";
import services from "@/services/landings";
import { trimFloatNumber, trimNumber } from "@/utils/processNumbers";
import standardizeDate from "@/utils/standardizeDate";
export const useLoansStore = defineStore("userLoans", {
  state: () => {
    return {
      loans: [],
      activeLoan: null,
      isFetching: false,
      metaPage: null,
      rate: null,
    };
  },
  actions: {
    async FETCH_LOANS(body) {
      try {
        const { data, meta } = await profile.fetchLoans(body).then((res) => res);
        this.SET_LOANS(data);
        this.metaPage = meta;
      } catch (e) {}
    },
    SET_LOANS(loans) {
      this.loans = loans;
    },
    async FETCH_LOAN(id) {
      try {
        const { data } = await profile.getLoan(id);
        await this.SET_ACTIVE_LOAN(data);
      } catch (e) {}
    },
    async SET_ACTIVE_LOAN(loan) {
      this.activeLoan = loan;
      if (loan) await this.SET_RATING();
    },
    async SET_RATING() {
      const res = await services
        .getCalculatorExchangeData({
          currency_from: this.activeLoan.collateral_currency.code,
          currency_to: this.activeLoan.loan_currency.code,
        })
        .then((res) => res.data);
      this.rate = trimNumber(+res.conversion_rate);
    },
    SET_FETCHING(value) {
      this.isFetching = value;
    },
  },
  getters: {
    properties: (state) => {
      const { activeLoan } = state;
      if (!activeLoan) {
        return;
      }

      const loanCurrencyCode = activeLoan.loan_currency?.code?.toUpperCase();
      const collateralCurrencyCode = activeLoan.collateral_currency?.code?.toUpperCase();
      const loanVisualDivisibility = activeLoan.loan_currency.visual_divisibility || 6;
      const collateralVisualDivisibility = activeLoan.collateral_currency.visual_divisibility || 6;
      // loan info
      const initial_loan_amount_view = `${trimFloatNumber(
        activeLoan?.initial_loan_amount,
        loanVisualDivisibility
      )} ${loanCurrencyCode}`;
      const daily_rate_view = `${activeLoan?.daily_rate * 100} %`;
      const dailyInterest = trimFloatNumber(
        activeLoan?.initial_loan_amount * activeLoan?.daily_rate,
        loanVisualDivisibility
      );
      const daily_interest_view = `${dailyInterest} ${loanCurrencyCode}`;
      const final_payment = `${trimFloatNumber(
        activeLoan?.loan_amount + dailyInterest,
        loanVisualDivisibility
      )} ${loanCurrencyCode}`;
      const created_at_view = new Date(standardizeDate(activeLoan.created_at)).toLocaleString();
      // ltv threshold
      const ltv_liquidation_threshold_view = `${activeLoan.ltv_liquidation_threshold} %`;
      // original collateral
      const initial_collateral_amount_view = `${trimFloatNumber(
        activeLoan.initial_collateral_amount,
        collateralVisualDivisibility
      )} ${collateralCurrencyCode}`;
      const initial_collateral_value = `${trimFloatNumber(
        +activeLoan?.initial_collateral_amount * state.rate,
        loanVisualDivisibility
      )} ${loanCurrencyCode}`;
      const initial_ltv_view = `${activeLoan.initial_ltv} %`;
      //current collateral
      const collateral_amount_view = `${trimFloatNumber(
        activeLoan.collateral_amount,
        collateralVisualDivisibility
      )} ${collateralCurrencyCode}`;
      const collateral_value = `${trimFloatNumber(
        +activeLoan?.collateral_amount * state.rate,
        loanVisualDivisibility
      )} ${loanCurrencyCode}`;
      const ltv_view = `${activeLoan.ltv} %`;

      return {
        ...state.activeLoan,
        // loan info
        initial_loan_amount_view,
        daily_rate_view,
        daily_interest_view,
        final_payment,
        created_at_view,
        // ltv threshold
        ltv_liquidation_threshold_view,
        // original collateral
        initial_collateral_amount_view,
        initial_collateral_value,
        initial_ltv_view,
        //current collateral
        collateral_amount_view,
        collateral_value,
        ltv_view,
        //rate
        rate: state.rate,
      };
    },
  },
});
