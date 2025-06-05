import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseSelect from "./BaseSelect.vue";
import { SelectItem } from "./BaseSelect.type";

const meta: Meta<typeof BaseSelect> = {
  title: "Base/Select",
  component: BaseSelect,
  tags: ["autodocs"],
  argTypes: {
    selectList: { control: { type: "object" }, description: "Select data" },
    selectedItem: { control: { type: "object" }, description: "Selected item form select list" },
    border: { control: { type: "boolean" }, description: "With border or not" },
    enums: {
      control: { type: "boolean" },
      description: "If value is `true` - select data is `string` array, `false` - `object` array",
    },
    placeholderText: { control: { type: "text" }, description: "Placeholder text" },
    isStateOpen: { control: { type: "boolean" }, description: "Show select options always or not" },
    withBalance: { control: { type: "boolean" }, description: "Show balance in options list" },
    withTitleBalance: { control: { type: "boolean" }, description: "Show balance in selected item" },
    isIcons: {
      control: { type: "boolean" },
      description: "Add icons by `display_code` to every option or not",
    },
    disabled: { control: { type: "boolean" }, description: "Disabled or not" },
    dataLabel: { control: { type: "text" }, description: "" },
    dataValue: { control: { type: "text" }, description: "" },
    clearable: { control: { type: "boolean" }, description: "Can clear select or not" },
    isCrypto: { control: { type: "boolean" }, description: "Crypto style (bold text) or not" },
    upperCase: { control: { type: "boolean" }, description: "Options tetx in uppercase or not" },
  },
};

export default meta;
type Story = StoryObj<typeof BaseSelect>;

const basicRender = (args: Args) => ({
  components: { BaseSelect },
  setup() {
    const changeSelectItem = (event: SelectItem) => {
      args.selectedItem = event;
    };

    return { args, changeSelectItem };
  },
  template: `<BaseSelect v-bind="args" @update:selectedItem="changeSelectItem" />`,
});

export const Basic: Story = {
  render: basicRender,
  args: {
    selectList: [
      {
        display_code: "btc",
        value: "BTC",
        balance: 1000,
      },
      {
        display_code: "eth",
        value: "ETH",
        balance: 1000,
      },
    ],
    selectedItem: {
      display_code: "eth",
      value: "ETH",
      balance: 1000,
    },
    border: true,
  },
};
