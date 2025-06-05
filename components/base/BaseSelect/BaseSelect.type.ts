export type SelectItem = {
  [key: string]: string | number;
  value: string;
};

export type Props = {
  isStateOpen?: boolean;
  border?: boolean;
  selectList: SelectItem[] | string[];
  selectedItem: SelectItem | string;
  withBalance?: boolean;
  withTitleBalance?: boolean;
  isIcons?: boolean;
  disabled?: boolean;
  dataLabel?: string;
  dataValue?: string;
  enums?: boolean;
  clearable?: boolean;
  isCrypto?: boolean;
  upperCase?: boolean;
  placeholderText?: string;
};

export type Emits = {
  (evt: "update:selectedItem", value: SelectItem | string | null): void;
};
