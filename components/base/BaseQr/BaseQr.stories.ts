import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseQr from "./BaseQr.vue";

const meta: Meta<typeof BaseQr> = {
  title: "Base/Qr",
  component: BaseQr,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "text" }, description: "The value content of qrcode" },
  },
};

export default meta;
type Story = StoryObj<typeof BaseQr>;

const basicRender = (args: Args) => ({
  components: { BaseQr },
  setup() {
    return { args };
  },
  template: `<BaseQr v-bind="args" />`,
});

export const Basic: Story = {
  render: basicRender,
  args: {
    value: "https://google.com",
  },
};
