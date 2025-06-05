import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseCheckbox from "./BaseCheckbox.vue";

const meta: Meta<typeof BaseCheckbox> = {
  title: "Base/Checkbox",
  component: BaseCheckbox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: { type: "boolean" }, description: "Disabled or not" },
    error: { control: { type: "text" }, description: "Error text" },
  },
  args: {
    default: "I accept and agree with Bonus Policy",
  },
};

export default meta;
type Story = StoryObj<typeof BaseCheckbox>;

const basicRender = (args: Args) => ({
  components: { BaseCheckbox },
  setup() {
    const checkbox = ref<boolean>(false);

    return { args, checkbox };
  },
  template: `<BaseCheckbox v-model="checkbox" v-bind="args">{{ args.default }}</BaseCheckbox>`,
});

export const Basic: Story = {
  render: basicRender,
};
