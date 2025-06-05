import { defineStore } from "pinia";
import profile from "~/services/profile";

export const useWalletsStore = defineStore("userWallets", {
  state: () => {
    return {
      wallets: [],
      currencies: [],
      settings: [],
      isFetching: false,
      exchangingCurrency: null,
    };
  },
  actions: {
    async FETCH_WALLETS() {
      try {
        // @ts-ignore
        this.wallets = await profile.getProfileWallets().then((res) => res.data);
      } catch (e) {}
    },
    SET_WALLETS(payload: []) {
      this.wallets = payload;
    },
    async FETCH_CURRENCIES() {
      try {
        this.currencies = await profile.getCurrencyList().then((res) => res.data);
      } catch (e) {}
    },
    async FETCH_SETTINGS() {
      try {
        this.settings = await profile.getWithdrawalData().then((res) => res.data);
      } catch (e) {}
    },
    SET_FETCHING(value) {
      this.isFetching = value;
    },
    SET_EXCHANGING_CURRENCY(value) {
      this.exchangingCurrency = value;
    },
  },
  getters: {
    getUserCurrencies(state) {
      let arr = state.currencies
        .filter((cur) => state.wallets?.find((wallet) => wallet.currency.code == cur.code))
        .map((curr) => {
          const foundedItem = state.wallets.find((item) => item.currency.code === curr.code);

          return {
            ...curr,
            balance: foundedItem.balance,
            balance_usd: foundedItem.balance_usd,
          };
        });

      return arr;
    },
    getCurrencyVisualDivisibility(state) {
      return (currency: string) => state.currencies.find((obj) => obj.code === currency)?.visual_divisibility;
    },
  },
});
