import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseButton from "./BaseButton.vue";

const meta: Meta<typeof BaseButton> = {
  title: "Base/Button",
  component: BaseButton,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "Button color type",
    },
    size: { control: { type: "select" }, options: ["small", "default", "big"], description: "Button size" },
    mobileFullWidth: { control: { type: "boolean" }, description: "Full width on mobile devices" },
    disabled: { control: { type: "boolean" }, description: "Disabled or not" },
    isLoading: { control: { type: "boolean" }, description: "Loading state or not" },
    loadingText: { control: { type: "text" }, description: "Loading text" },
    link: { control: { type: "boolean" }, description: "Link tag or not" },
    to: { control: { type: "text" }, description: "If `link` property is `true`, this value needs to be filled" },
    default: { control: { type: "text" }, description: "Slot content" },
  },
  args: {
    default: "Start trading",
  },
};

export default meta;
type Story = StoryObj<typeof BaseButton>;

const basicRender = (args: Args) => ({
  components: { BaseButton },
  setup() {
    return { args };
  },
  template: `<BaseButton v-bind="args">{{ args.default }}</BaseButton>`,
});

export const Primary: Story = {
  args: {
    color: "primary",
  },
  render: basicRender,
};

export const Secondary: Story = {
  args: {
    color: "secondary",
  },
  render: basicRender,
};

export const Tertiary: Story = {
  args: {
    color: "tertiary",
  },
  render: basicRender,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: basicRender,
};

export const Big: Story = {
  args: {
    color: "primary",
    size: "big",
  },
  render: basicRender,
};

export const Small: Story = {
  args: {
    color: "primary",
    size: "small",
  },
  render: basicRender,
};

export const Loading: Story = {
  args: {
    color: "primary",
    isLoading: true,
  },
  render: basicRender,
};
