import { defineStore } from "pinia";
import { activeCountries } from "@/constants/profile";
import { getAppSettings } from "@/services/landings";

export const useUserStore = defineStore("userData", {
  state: () => {
    return {
      user: null,
      verification: null,
      isConnected: false,
      isFetching: true,
      minFirstAmount: null,
      minAmount: null
    };
  },
  actions: {
    SET_USER(data) {
      if (data?.language) {
        data.language = activeCountries.find((element) => element.value === data.language);
      }
      if (data?.phone_number) {
        data.phone_number = data.phone_number.replaceAll(" ", "");
      }
      this.user = data;
    },
    SET_VERIFICATION(data) {
      this.verification = data;
    },
    SET_CONNECTED(value) {
      this.isConnected = value;
    },
    SET_FETCHING(value) {
      this.isFetching = value;
    },
    async FETCH_MIN_AMOUNT() {
      try {
        const { data } = await useAsyncData("minAmount", () => getAppSettings());
        this.minFirstAmount = data.value?.data?.trader_min_first_deposit_amount || 100;
        this.minAmount = data.value?.data?.trader_min_deposit_amount || 10;
      } catch (error) {
        console.dir(error);
      }
    },
  },

  getters: {
    isAuth: (state) => (state.user ? true : false),
    verifiedUser: (state) => (state.user?.identity_verified_at ? true : false),
  },
});
