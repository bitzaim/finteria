export type Props = {
  modelValue: boolean;
  persistable?: boolean;
  preventClickOutside?: boolean;
};

export type Emits = {
  (evt: "update:modelValue", value: boolean): void;
};
