import { defineStore } from "pinia";

export const useLangStore = defineStore({
  id: "lang",
  state: () => ({
    locale: "en",
    languages: null,
  }),
  actions: {
    SET_LANGUAGE(data) {
      this.languages = data;
    },
    change(val) {
      this.locale = val;
    },
  },
});
