import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseLoader from "./BaseLoader.vue";

const meta: Meta<typeof BaseLoader> = {
  title: "Base/Loader",
  component: BaseLoader,
  tags: ["autodocs"],
  argTypes: {
    inline: { control: { type: "boolean" }, description: "Inline size (small) or block size (big)" },
    primary: { control: { type: "boolean" }, description: "Primary color theme" },
    withText: { control: { type: "boolean" }, description: "With loading text or not" },
    loadingText: { control: { type: "text" }, description: "Loading text" },
  },
};

export default meta;
type Story = StoryObj<typeof BaseLoader>;

const basicRender = (args: Args) => ({
  components: { BaseLoader },
  setup() {
    return { args };
  },
  template: `<BaseLoader v-bind="args" />`,
});

export const Basic: Story = {
  render: basicRender,
};
