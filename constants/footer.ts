import { useDomain } from "@/composition/useDomain";

type FooterLink = {
  name?: string;
  text: string;
  link: string;
  target?: string;
};

export type FooterLinkExtend = {
  title: string;
  links: FooterLink[];
};

export const useFooterConstants = () => {
  const { optionsPlatformURL, GUIDES_URL } = useDomain();
  const footerLinks: FooterLinkExtend[] = [
    {
      title: "footer.col1.title",
      links: [
        {
          text: "footer.col1.ul[0].label",
          link: "/files/documents/terms-and-conditions.pdf",
          target: "_blank",
        },
        {
          text: "footer.col1.ul[1].label",
          link: "/files/documents/bonus-policy.pdf",
          target: "_blank",
        },
        {
          text: "footer.col1.ul[2].label",
          link: "/files/documents/privacy-policy.pdf",

          target: "_blank",
        },
        {
          text: "footer.col1.ul[3].label",
          link: "/files/documents/aml-policy.pdf",
          target: "_blank",
        },
        {
          text: "footer.col1.ul[4].label",
          link: "/files/documents/risk-disclosure.pdf",
          target: "_blank",
        },
      ],
    },
    {
      title: "footer.colBlog.title",
      links: [
        {
          text: "footer.colBlog.ul[0].label",
          link: "/blog/market-research",
        },
        {
          text: "footer.colBlog.ul[1].label",
          link: "/blog/education",
        },
        {
          text: "footer.colBlog.ul[2].label",
          link: "/blog/reviews",
        },
        {
          text: "footer.colBlog.ul[3].label",
          link: "/press-and-media",
        },
      ],
    },
    {
      title: "footer.colMarkets.title",
      links: [
        {
          text: "footer.colMarkets.ul[0].label",
          link: "/markets/forexcurrencies",
        },
        {
          text: "footer.colMarkets.ul[1].label",
          link: "/markets/cryptocurrencies",
        },
        {
          text: "footer.colMarkets.ul[2].label",
          link: "/markets/currency-strength",
        },
        {
          text: "footer.colMarkets.ul[3].label",
          link: "/markets/crypto-strength",
        },
      ],
    },
    {
      title: "footer.col2.title",
      links: [
        {
          name: "platform",
          text: "footer.col2.ul[0].label",
          link: optionsPlatformURL.value,
          target: "_blank",
        },
        {
          text: "footer.col2.ul[1].label",
          link: useRuntimeConfig().public.ANDROID_APP_URL,
          target: "_blank",
        },
        {
          text: "footer.col2.ul[4].label",
          link: GUIDES_URL,
          target: "_blank",
        },
        {
          text: "footer.col2.ul[5].label",
          link: "https://reffers.com",
          target: "_blank",
        },
      ],
    },
  ];
  return footerLinks;
};
