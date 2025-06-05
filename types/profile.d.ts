export interface User {
  agreement_signed_at: string | null;
  country: string;
  created_at: string;
  email: string;
  email_verified_at: string | null;
  first_name: string | null;
  id: number;
  identity_verified_at: string | null;
  language: string;
  last_name: null | string;
  ml_suspected_at: null | string;
  permissions: Record<string, boolean>;
  phone_number: string | null;
  phone_verified_at: string | null;
}

export interface PersonalData {
  first_name: string;
  last_name: string;
}
export type PlatformType = "mt" | "options";

export type TradingAccount = {
  id: number;
  external_id: number;
  balance: string;
  withdrawable_balance: string;
  bonus: string;
  currency: string;
  group: string;
  can_withdraw: number;
  created_at: string;
  active_promo_bonus: string | number | null;
  open_trader_invoice: string | number | null;
  open_withdrawal_order: string | number | null;
};
