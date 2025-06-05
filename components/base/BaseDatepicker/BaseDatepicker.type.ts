export type Props = {
  modelValue: Date | Date[] | null;
  range?: boolean;
};

export type Emits = {
  (evt: "update:modelValue", value: Date | Date[] | null): void;
};
