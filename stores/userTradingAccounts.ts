import { defineStore } from "pinia";

export type UserTradingState = {
  accounts: any[];
  account: any;
  invoice: any;
  executedInvoive: {
    [key: string]: any;
    expires_at?: string;
    created_at?: string;
  };
  isLoading: boolean;
  policyError: string;
};

export const useTradingStore = defineStore("userTrading", {
  state: () => {
    return {
      accounts: [],
      account: {},
      invoice: {},
      executedInvoive: {},
      isLoading: false,
      policyError: "",
    } as UserTradingState;
  },
  actions: {
    SET_ACCOUNTS(data) {
      this.accounts = data;
    },
    SET_ACCOUNT(data) {
      this.account = data;
    },
    SET_INVOICE(data) {
      this.invoice = data;
    },
    SET_EXECUTED_INVOICE(data) {
      this.executedInvoive = data;
    },
    SET_FETCHING(value) {
      this.isLoading = value;
    },
    SET_POLICY_ERROR(value) {
      this.policyError = value;
    },
  },
  getters: {},
});
