import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseCard from "./BaseCard.vue";
import BaseButton from "../BaseButton/BaseButton.vue";

const meta: Meta<typeof BaseCard> = {
  title: "Base/Card",
  component: BaseCard,
  tags: ["autodocs"],
  argTypes: {
    background: { control: { type: "color" }, description: "Background color" },
    inContent: { control: { type: "boolean" }, description: "If `true` - small paddings" },
  },
};

export default meta;
type Story = StoryObj<typeof BaseCard>;

const basicRender = (args: Args) => ({
  components: { BaseCard, BaseButton },
  setup() {
    return { args };
  },
  template: `
    <BaseCard v-bind="args">
      <BaseButton>Test Card</BaseButton>
    </BaseCard>
  `,
});

export const Basic: Story = {
  render: basicRender,
  args: {
    inContent: true,
  },
};
