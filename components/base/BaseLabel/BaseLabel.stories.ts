import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseLabel from "./BaseLabel.vue";

const meta: Meta<typeof BaseLabel> = {
  title: "Base/Label",
  component: BaseLabel,
  tags: ["autodocs"],
  argTypes: {
    forValue: { control: { type: "boolean" }, description: "Label's `for` attribute for input" },
    small: { control: { type: "boolean" }, description: "Small or not" },
  },
  args: {
    default: "Email",
  },
};

export default meta;
type Story = StoryObj<typeof BaseLabel>;

const basicRender = (args: Args) => ({
  components: { BaseLabel },
  setup() {
    return { args };
  },
  template: `<BaseLabel v-bind="args">{{ args.default }}</BaseLabel>`,
});

export const Basic: Story = {
  render: basicRender,
};
