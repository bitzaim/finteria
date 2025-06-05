import profile from "@/services/profile";
import type { TradingAccount } from "@/types/profile";
import { useDomain } from "@/composition/useDomain";

type RedirectPlatformDefaultOptions = {
  deposit?: string;
  group?: string;
  mock?: boolean;
  instrument?: string | null;
  strategyID?: number | null;
};

type QueryParams = {
  token: string;
  accountID: string | number;
  instrument?: string | null;
  strategyID?: number | null;
};

export const redirectToPlatform = async (
  account: TradingAccount & { mock?: boolean },
  instrument: string | null = null,
  strategyID: number | null = null
) => {
  try {
    const { optionsPlatformURL } = useDomain()

    const response = await profile.getTokenForRedirectPlatform(account?.id);
    const mockAccount = account?.mock && "mock";
    const queryParams: QueryParams = {
      token: response.refresh_token,
      accountID: mockAccount || account.external_id,
    };

    if (instrument) {
      queryParams.instrument = instrument;
    }

    if (strategyID) {
      queryParams.strategyID = strategyID;
    }

    const query = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join("&");

    return `${optionsPlatformURL.value}redirect?${query}`;
  } catch (error) {
    console.log(error);
  }
};

export const redirectToDefaultProfilePlatform = async (
  {
    deposit = "usd",
    group = "live",
    mock = false,
    instrument = null,
    strategyID = null,
  }: RedirectPlatformDefaultOptions,
  target = true
) => {
  try {
    const tradingAccounts = await profile.fetchTradingAccounts({
      page: 1,
      limit: 100,
    });

    const defaultDeposit = tradingAccounts.find(
      (account) => account.currency.toLowerCase() === deposit && account.group.toLowerCase() === group
    );

    if (defaultDeposit) {
      let myUrl = "/";
      if (!mock) {
        myUrl = (await redirectToPlatform(defaultDeposit, instrument, strategyID)) || "/";
      } else {
        myUrl = (await redirectToPlatform({ ...defaultDeposit, mock: true }, instrument, strategyID)) || "/";
      }
      const windowRef = window.open("", target ? "_blank" : "_self");
      if (windowRef) {
        windowRef.location.href = myUrl;
      }
    } else {
      window.open("/404", "_self"); // не хотел исползовать window.open пришлось так как не нашел проблему с редиректом.
    }
  } catch (error) {
    console.log(error);
  }
};
