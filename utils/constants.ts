import { useGlobals } from "~~/stores/globals";

const COOKIE_META_KEYS = ["local", "development", "production"] as const;

export type CookieMetaKeys = typeof COOKIE_META_KEYS[number];

export type CookieMeta = {
  [K in CookieMetaKeys]: {
    domain: () => string | null;
    name: string;
  };
};

// key names must match SENTRY_ENV possible variants
export const cookieMeta: CookieMeta = {
  local: {
    domain: () => null,
    name: "local-Bearer",
  },
  development: {
    domain: () => useGlobals().getRootDomain,
    name: "dev-Bearer",
  },
  production: {
    domain: () => useGlobals().getRootDomain,
    name: "prod-Bearer",
  },
};

// for widget changelly
export function getMinimumAmount(currency: string): number {
  switch (currency) {
    case "usd":
      return 50;
    case "eur":
      return 50;
    default:
      return 50;
  }
}
