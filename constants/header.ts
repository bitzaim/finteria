import { useDomain } from "@/composition/useDomain";

type HeaderLink = {
  name: string;
  link: string;
  target?: string;
  hash?: string;
};

type HeaderLinkExtend = {
  label: string;
  links: HeaderLink[];
};

export const useHeaderMenu = (): HeaderLinkExtend[] => {
  const { optionsPlatformURL, GUIDES_URL } = useDomain()
  return [
    {
      label: "header.menu.platforms.title",
      links: [
        {
          name: "header.menu.platforms.web",
          link: optionsPlatformURL.value,
          target: "_blank",
        },
        {
          name: "header.menu.platforms.android",
          link: useRuntimeConfig().public.ANDROID_APP_URL,
          target: "_blank",
        },
      ],
    },

    {
      label: "header.menu.markets.title",
      links: [
        {
          name: "header.menu.markets.forex",
          link: "/markets/forexcurrencies",
        },
        {
          name: "header.menu.markets.crypto",
          link: "/markets/cryptocurrencies",
        },
        {
          name: "header.menu.markets.currencystrength",
          link: "/markets/currency-strength",
        },
        {
          name: "header.menu.markets.cryptostrength",
          link: "/markets/crypto-strength",
        },
      ],
    },

    {
      label: "header.menu.services.title",
      links: [
        {
          name: "header.menu.services.copytrading",
          link: "/",
          hash: "#copytrading",
        },
        {
          name: "header.menu.services.contest",
          link: "/contest",
        },
        {
          name: "header.menu.services.blog",
          link: "/blog",
        },
        {
          name: "header.menu.services.pressAndMedia",
          link: "/press-and-media",
        },
        {
          name: "header.menu.services.helpGuides",
          link: GUIDES_URL,
          target: "_blank",
        },
      ],
    },
  ];
};
