import axios from "axios";
import { defineNuxtConfig } from "nuxt/config";
import { SitemapArticle } from "./services/types/blog.type";

const baseHostname = process.env.META_HOST_URL || "";
const hostnameLastSymbol = baseHostname[baseHostname.length - 1];
const clearedHostname = hostnameLastSymbol === "/" ? baseHostname.substring(0, baseHostname.length - 1) : baseHostname;

const HREFLANGS_LIST = ["es", "fr", "pt", "it", "pl", "tr", "zh", "ja", "ru", "uk"];

const getHreflangUrls = (host: string | undefined, href?: string, hreflangs: string[] = HREFLANGS_LIST) => {
  return hreflangs.map((hreflang) => {
    const hrefResult = href ? `/${href}` : "";

    return {
      hreflang,
      href: `${host}${hreflang}${hrefResult}`,
    };
  });
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: false,
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ["/", "/es", "/fr", "/pt", "/it", "/pl", "/tr", "/zh", "/ja", "/ru", "/uk"],
    },
  },
  routeRules: {
    // @ts-ignore
    "/profile/**": { ssr: false },
    "/": {
      sitemap: {
        priority: 1,
      },
    },
  },
  buildModules: ["@pinia/nuxt"],

  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/robots",
    "nuxt-simple-sitemap",
    "@nuxtjs/stylelint-module",
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // automatically imports `defineStore`
          "defineStore", // import { defineStore } from 'pinia'
          // automatically imports `defineStore` as `definePiniaStore`
          ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
        ],
      },
    ],
  ],
  i18n: {
    baseUrl: clearedHostname,
    locales: [
      { code: "en", iso: "en", name: "English", file: "en.json" },
      { code: "es", iso: "es", name: "Español", file: "es.json" },
      { code: "fr", iso: "fr", name: "Français", file: "fr.json" },
      { code: "pt", iso: "pt", name: "Português", file: "pt_BR.json" },
      { code: "it", iso: "it", name: "Italiano", file: "it.json" },
      { code: "pl", iso: "pl", name: "Polski", file: "pl.json" },
      { code: "tr", iso: "tr", name: "Türkçe", file: "tr.json" },
      { code: "zh", iso: "za", name: "中文", file: "zh_Hans.json" },
      { code: "ja", iso: "ja", name: "日本語", file: "ja.json" },
      { code: "ru", iso: "ru", name: "Русский", file: "ru.json" },
      { code: "uk", iso: "uk", name: "Український", file: "uk.json" },
      // { code: "cs", name: "Čeština", file: "cs.json" },
      // { code: "in", name: "Indonesia", file: "in.json" },
      // { code: "pt", name: "Português", file: "pt.json" },
      // { code: "de", name: "Deutsch", file: "de.json" },
    ],
    precompile: {
      strictMessage: false,
    },
    detectBrowserLanguage: {
      useCookie: false,
    },
    defaultLocale: "en",
    defaultDirection: "ltr",
    lazy: true,
    langDir: "./locales/",
    trailingSlash: true,
    vueI18n: "./i18n.config.ts",
    globalInjection: true,
  },
  robots: {
    configPath: "~/robots.config",
    /* module options */
  },

  sitemap: {
    defaults: {
      priority: 0.9,
      changefreq: "weekly",
    },
    exclude: [
      "/profile/**",
      "/reset/**",
      "/redirect/**",
      "/es",
      "/fr",
      "/pt",
      "/it",
      "/pl",
      "/tr",
      "/zh",
      "/ja",
      "/ru",
      "/uk",
    ],
    autoAlternativeLangPrefixes: false,
    urls: async () => {
      const { data: response } = await axios.get("/article/sitemap", {
        baseURL: process.env.API_MEDIA_URL,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      const dynamicUrls = response.data.map((article: SitemapArticle) => ({
        loc: `/blog/${article.slug}`,
        lastmod: article.updated_at,
        changefreq: "weekly",
        priority: 0.9,
        alternatives: getHreflangUrls(article.slug),
      }));

      const staticUrls = [
        "/land/forex/a/",
        "/land/forex/b/",
        "/land/forex/c/",
        "/land/forex/d/",
        "/land/crypto/a/",
        "/land/crypto/b/",
        "/land/crypto/c/",
        "/land/crypto/d/",
        "/land/outstanding-trader/",
      ].map((page) => ({
        loc: page,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.9,
      }));

      return dynamicUrls.concat(staticUrls);
    },
    sitemaps: {
      com: {
        siteUrl: process.env.META_HOST_URL,
        urls: [
          {
            url: "/",
            alternatives: getHreflangUrls(process.env.META_HOST_URL),
          },
          {
            url: "/blog",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "blog"),
          },
          {
            url: "/login",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "login"),
          },
          {
            url: "/contest",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "contest"),
          },
          {
            url: "/sign-up",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "sign-up"),
          },
          {
            url: "/exchange",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "exchange"),
          },
          {
            url: "/payment-result",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "payment-result"),
          },
          {
            url: "/press-and-media",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "press-and-media"),
          },
          {
            url: "/markets/crypto-strength",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "markets/crypto-strength"),
          },
          {
            url: "/markets/forexcurrencies",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "markets/forexcurrencies"),
          },
          {
            url: "/markets/cryptocurrencies",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "markets/cryptocurrencies"),
          },
          {
            url: "/markets/currency-strength",
            alternatives: getHreflangUrls(process.env.META_HOST_URL, "markets/currency-strength"),
          },
        ],
      },
      pro: {
        siteUrl: process.env.META_HOST_URL_SECONDARY,
        urls: [
          {
            url: "/",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY),
          },
          {
            url: "/blog",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "blog"),
          },
          {
            url: "/login",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "login"),
          },
          {
            url: "/contest",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "contest"),
          },
          {
            url: "/sign-up",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "sign-up"),
          },
          {
            url: "/exchange",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "exchange"),
          },
          {
            url: "/payment-result",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "payment-result"),
          },
          {
            url: "/press-and-media",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "press-and-media"),
          },
          {
            url: "/markets/crypto-strength",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "markets/crypto-strength"),
          },
          {
            url: "/markets/forexcurrencies",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "markets/forexcurrencies"),
          },
          {
            url: "/markets/cryptocurrencies",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "markets/cryptocurrencies"),
          },
          {
            url: "/markets/currency-strength",
            alternatives: getHreflangUrls(process.env.META_HOST_URL_SECONDARY, "markets/currency-strength"),
          },
        ],
      },
    },
  },

  build: {
    optimization: {
      minimize: true,
    },
    optimizeCSS: true,
    transpile: ["vue-chartjs", "chart.js", "chartjs-plugin-datalabels", "nuxt/app"],
  },
  app: {
    head: {
      script: [
        process.env.SENTRY_ENV === "production"
          ? {
              children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W36239F');`,
            }
          : {
              children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W36239F');`,
            },
        process.env.SENTRY_ENV === "production"
          ? {
              src: "//code.jivosite.com/widget/bTizu4avTy",
              async: true,
            }
          : {},
        process.env.SENTRY_ENV === "production" ? { src: "//code.jivosite.com/widget/bTizu4avTy", async: true } : {},
        process.env.SENTRY_ENV === "production"
          ? {
              children: `(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:3292466,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
            }
          : {},
      ],
      noscript:
        process.env.SENTRY_ENV === "production"
          ? [
              {
                children: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W36239F"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              },
            ]
          : [
              {
                children: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W36239F"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              },
            ],
      meta: [
        {
          name: "keywords",
          content:
            "forex, crypto trading, earn crypto, currency trading, exchange crypto, borrow stablecoin, staking crypto",
        },
        { name: "copyright", content: "Finteria Markets LLC" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://code.jivosite.com", crossorigin: "anonymous" },
        { rel: "preconnect", href: "https://node-ya-1.jivosite.com", crossorigin: "anonymous" },
        { rel: "preconnect", href: "https://in.hotjar.com", crossorigin: "anonymous" },
        { rel: "preconnect", href: "https://www.googletagmanager.com", crossorigin: "anonymous" },
      ],
    },
  },

  css: [
    // SCSS file in the project
    "~/assets/style/main.scss",
  ],
  runtimeConfig: {
    public: {
      META_HOST_URL: process.env.META_HOST_URL,
      SITE_KEY: process.env.SITE_KEY,
      LARAVEL_ECHO_KEY: process.env.LARAVEL_ECHO_KEY,
      API_BASE_URL: process.env.API_BASE_URL,
      API_MEDIA_URL: process.env.API_MEDIA_URL,
      API_OPTIONS_URL: process.env.API_OPTIONS_URL,
      API_OPTIONS_URL_WEBSOCKET: process.env.API_OPTIONS_URL_WEBSOCKET,
      PLATFORM_URL: process.env.PLATFORM_URL,
      ANDROID_APP_URL: process.env.ANDROID_APP_URL,
      SENTRY_ENV: process.env.SENTRY_ENV,
      SENTRY_DSN: process.env.SENTRY_DSN,
      LARAVEL_ECHO_HOST: process.env.LARAVEL_ECHO_HOST,
      LARAVEL_ECHO_CLUSTER: process.env.LARAVEL_ECHO_CLUSTER,
      SHOW_PROFILE: false,
    },
  },
  stylelint: {
    lintOnStart: false,
    failOnError: false,
  },
});
