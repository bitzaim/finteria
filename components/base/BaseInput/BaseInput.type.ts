export type Props = {
  label?: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: string | boolean;
  modelValue: number | string | null;
  small?: boolean;
  min?: number;
  max?: number | string | boolean;
  textRight?: boolean;
  maxlength?: number;
  readonly?: boolean;
  inputmode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  maska?: {
    data: string;
    tokens?: string;
    options?: {
      preProcess: (value: string) => void;
    };
  };
  copy?: boolean;
};

export type Emits = {
  (evt: "update:modelValue", value: string): void;
};
