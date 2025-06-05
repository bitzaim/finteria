import { defineStore } from "pinia";
import { replaceWithCurrentTld } from '@/utils/helpers'

export const useGlobals = defineStore("globalsStore", {
  state: () => {
    return {
      href: useRuntimeConfig().public.META_HOST_URL,
    };
  },

  actions: {
    SET_HREF(value: string) {
      this.href = value;
    },
  },

  getters: {
    getRootDomain(): string {
      const url = new URL(this.href);
      const splitted = url.hostname.split(".");
      const domainroot = splitted.slice(-2).join(".");

      return domainroot;
    },

    tld(): string {
      try {
        const url = new URL(this.href);
        const splitted = url.hostname.split(".");
        const tld = splitted[splitted.length - 1];

        return tld === '' ? 'com' : tld;
      } catch (err) {
        return 'com'
      }
    },

    optionsPlatformURL(): string {
      return replaceWithCurrentTld(useRuntimeConfig().public.PLATFORM_URL)
    }
  },
});
