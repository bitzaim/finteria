import type { RouteLocationRaw } from "vue-router";

export type Props = {
  color?: "primary" | "secondary" | "tertiary";
  size?: "small" | "default" | "big";
  mobileFullWidth?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  link?: boolean;
  to?: string | RouteLocationRaw;
};
