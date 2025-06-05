export type Language = {
  code: string;
  name: string;
};

export type Props = {
  modelValue: boolean;
  languages?: Language[];
  activeLang: Language;
  withoutChevrone?: boolean;
};

export type Emits = {
  (evt: "update:modelValue", value: boolean): void;
};
