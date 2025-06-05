export type Props = {
  modelValue: boolean;
  disabled?: boolean;
  error?: string;
};

export type Emits = {
  (evt: "update:modelValue", value: boolean): void;
};
