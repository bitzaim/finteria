import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseCheckList from "./BaseCheckList.vue";

const meta: Meta<typeof BaseCheckList> = {
  title: "Base/CheckList",
  component: BaseCheckList,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: { type: "array" },
      description: "List items",
    },
    titleTag: {
      control: { type: "text" },
      description: "Title tag. Default is `p`",
    },
  },
  args: {
    items: [
      {
        title: "Sign Up",
        text: "Registration takes less than a minute",
      },
      {
        title: "Fund your account",
        text: "Make a deposit and start trading",
      },
      {
        title: "Trade & Withdraw",
        text: "Trade, earn and withdraw your profit!",
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof BaseCheckList>;

const basicRender = (args: Args) => ({
  components: { BaseCheckList },
  setup() {
    return { args };
  },
  template: `<BaseCheckList v-bind="args" />`,
});

export const Basic: Story = {
  render: basicRender,
};
