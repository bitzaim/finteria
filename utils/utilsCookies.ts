import { CookieMetaKeys, cookieMeta } from "./constants";

export function getCookie(name: string): string | undefined {
  let matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name: string, value: string, options: CookieAttributes = {}): void {
  const config = useRuntimeConfig();
  const sentryEnv = config.public.SENTRY_ENV as CookieMetaKeys;
  const domain = cookieMeta[sentryEnv].domain();

  if (domain) {
    options = {
      path: "/",
      // при необходимости добавьте другие значения по умолчанию
      ...options,
      domain: domain,
    };
  } else {
    options = {
      path: "/",
      // при необходимости добавьте другие значения по умолчанию
      ...options,
    };
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

// setCookie('user', 'John', {secure: true, 'max-age': 3600});

export function deleteCookie(name: string): void {
  setCookie(name, "", {
    "max-age": -1,
  });
}

export interface CookieAttributes {
  path?: string;
  domain?: string;
  expires?: number | Date;
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
  secure?: boolean;
  "max-age"?: number | string;
  [property: string]: any;
}
