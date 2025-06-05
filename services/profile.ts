import { TradingAccount } from "@/types/profile";
import { api, accountApi, getServerRequest } from "./axios";
import convertQueryParams from "~/utils/convertQueryParams";

const getPageRates = (page) =>
  api()
    .get(`/assets/${page}`)
    .then((res) => res.data);
const fetchCurrenciesBorrow = () => api().get(`calculator/borrow`);
const calculateCurrenciesBorrow = (body) => api().post(`calculator/borrow/calculate`, body);

const getCurrencyList = () =>
  api()
    .get("/currencies")
    .then((res) => res.data);

const getUserProfile = (): Promise<any> => accountApi("/profile", { method: "GET" });

const getListLanguage = (): Promise<any> => accountApi(`/languages`, { method: "GET" });

const updateLanguage = (languageId: Record<string, string>) =>
  accountApi("/profile/language", { method: "PATCH", body: languageId });

const updatePassword = (data) => accountApi("/profile/password", { method: "PATCH", body: data });

const getSessionsList = (params) =>
  getServerRequest(`/profile/sessions`, {
    method: "GET",
    params: params,
    key: "SessionList",
  }).then((response) => response.data.value);

const getSessionsListWithParams = (params) => accountApi(`/profile/sessions`, { method: "GET", params: params });

const sendVerificatiOnEmail = (): Promise<any> => accountApi("/profile/send-verification-email?method=code", { method: "GET" });

const confirmEmailByCode = (code, token) =>
  accountApi(`/profile/email/verify/code?code=${code}&token=${token}`, { method: "GET" });

const enableTwoFactor = () => api().post(`/profile/two-fa/enable`);

const disableTwoFactor = () => api().post(`/profile/two-fa/disable`);

// Ошибка в postman метод PATCH
const updatePhoneNumber = (newPhone): Promise<any> =>
  accountApi(`/profile/phone-number`, { method: "PATCH", body: newPhone });

// Why don't use get?
const sendCodeOnPhone = (): Promise<any> => accountApi("/profile/phone-number/send", { method: "POST" });

const verificationPhoneWithCode = (code) => accountApi("/profile/phone-number/verify", { method: "POST", body: code });

//exchange
const getAccountExchangeData = () => accountApi("/exchange", { method: "GET" }).then((res) => res);
const fetchExchangeQuote = (data) => accountApi("/exchange/quote", { method: "POST", body: data }).then((res) => res);
const executeExchangeQuote = (data) =>
  accountApi("/exchange/quote/execute", { method: "POST", body: data }).then((res) => res);

//wallets
const getProfileWallets = () => accountApi("/profile/wallets", { method: "GET" }).then((res) => res);
const createNewWallet = (data) => accountApi("/wallet", { method: "POST", body: data }).then((res) => res);
const receiveAddress = (id, network = "") =>
  accountApi(`/wallet/${id}/receive-address/${network}`, { method: "GET" }).then((res) => res);
const getWithdrawalData = () => accountApi(`/withdrawal/settings`, { method: "GET" }).then((res) => res);
const sendWithdrawal = (data) => accountApi(`/withdrawal/orders`, { method: "POST", body: data }).then((res) => res);
const fetchTransactions = (data) =>
  accountApi(`/wallet/transactions?${convertQueryParams(data)}`, {
    method: "GET",
  }).then((res) => res);
const fetchTransactionEnums = () => accountApi(`/enums`, { method: "GET" }).then((res) => res);

// trading accounts
const fetchTradingAccounts = (data: { [key: string]: any }): Promise<TradingAccount[]> =>
  accountApi(`/trader/account?${convertQueryParams(data)}`, {
    method: "GET",
    // @ts-ignore
  }).then((res) => res.data);

const fetchTradingAccount = (id) => accountApi(`/trader/account/${id}`, { method: "GET" }).then((res) => res);
const createTradingAccount = (data) => accountApi(`/trader/account`, { method: "POST", body: data }).then((res) => res);
const createTradingTransfer = (id, data) =>
  accountApi(`/trader/account/${id}/withdraw`, {
    method: "POST",
    body: data,
  }).then((res) => res);
const cancelTradingTransfer = (id) =>
  accountApi(`/trader/withdrawal/${id}/cancel`, {
    method: "PATCH",
  });
const getBonusLevels = (curr) => accountApi(`/trader/bonus-levels/${curr}`, { method: "GET" }).then((res) => res);
const createDepositInvoice = (data) =>
  accountApi(`/trader/invoice/quote`, { method: "POST", body: data }).then((res) => res);
const executeDepositInvoice = (data) =>
  accountApi(`/trader/invoice/quote/execute`, {
    method: "POST",
    body: data,
  }).then((res) => res);
const getExecutedInvoice = (id) => accountApi(`/trader/invoice/${id}`, { method: "GET" }).then((res) => res);
const cancelDepositInvoice = (id) => accountApi(`/trader/invoice/${id}/close`, { method: "PATCH" }).then((res) => res);
const getTokenForRedirectPlatform = (accountID: number) =>
  // @ts-ignore
  accountApi(`/trader/${accountID}/token`, { method: "GET" }).then((res) => res.data);
// promocode
const applyPromocode = (promocode) => accountApi(`/promo/code/${promocode}`, { method: "POST" }).then((res) => res);

//loans
const fetchLoans = (data) =>
  accountApi(`/loan-contracts?${convertQueryParams(data)}`, { method: "GET" }).then((res) => res);
const fetchLoanCurrencies = () => accountApi(`/loan/currency`, { method: "GET" }).then((res) => res);
const createLoanQuote = (data) => accountApi(`/loan/quote`, { method: "POST", body: data }).then((res) => res);
const executeLoanQuote = (data) => accountApi(`/loan/quote/execute`, { method: "POST", body: data }).then((res) => res);
const getLoan = (id) => accountApi(`/loan-contracts/${id}`, { method: "GET" }).then((res) => res);
const makeLoanDeposit = (id, data) =>
  accountApi(`/loan-contracts/${id}/collateral/deposit`, { method: "POST", body: data }).then((res) => res);
const makeLoanWithdraw = (id, data) =>
  accountApi(`/loan-contracts/${id}/collateral/withdraw`, { method: "POST", body: data }).then((res) => res);

// payment
const getPaymentGateways = async (lang: string) => {
  const result = await accountApi("/payment/gateways", {
    method: "GET",
    headers: {
      'Accept-Language': lang
    }
  });
  return result.data;
};

export default {
  getPageRates,
  fetchCurrenciesBorrow,
  calculateCurrenciesBorrow,
  getUserProfile,
  getListLanguage,
  updateLanguage,
  updatePassword,
  getSessionsList,
  getSessionsListWithParams,
  sendVerificatiOnEmail,
  confirmEmailByCode,
  enableTwoFactor,
  disableTwoFactor,
  updatePhoneNumber,
  sendCodeOnPhone,
  verificationPhoneWithCode,
  getAccountExchangeData,
  fetchExchangeQuote,
  executeExchangeQuote,
  getProfileWallets,
  getCurrencyList,
  createNewWallet,
  receiveAddress,
  getWithdrawalData,
  sendWithdrawal,
  fetchTransactions,
  fetchTransactionEnums,
  fetchTradingAccounts,
  fetchTradingAccount,
  createTradingTransfer,
  cancelTradingTransfer,
  getBonusLevels,
  createDepositInvoice,
  createTradingAccount,
  executeDepositInvoice,
  getTokenForRedirectPlatform,
  getExecutedInvoice,
  cancelDepositInvoice,
  applyPromocode,
  fetchLoans,
  fetchLoanCurrencies,
  createLoanQuote,
  executeLoanQuote,
  getLoan,
  makeLoanDeposit,
  makeLoanWithdraw,
  getPaymentGateways,
};
