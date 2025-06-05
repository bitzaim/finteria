import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseInput from "./BaseInput.vue";
import BaseLabel from "../BaseLabel/BaseLabel.vue";

const meta: Meta<typeof BaseInput> = {
  title: "Base/Input",
  component: BaseInput,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Input ID for label",
    },
    type: {
      control: { type: "select" },
      options: ["text", "number", "email", "tel", "password"],
      description: "Input type",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disabled or not",
    },
    placeholder: {
      control: { type: "text" },
      description: "Input placeholder",
    },
    error: {
      control: { type: "text" },
      description: "Error text (if exists)",
    },
    small: {
      control: { type: "boolean" },
      description: "Small or not",
    },
    max: {
      control: { type: "number" },
      description: "Max value",
    },
    textRight: {
      control: { type: "boolean" },
      description: "If `true` - text align = right",
    },
    maxlength: {
      control: { type: "number" },
      description: "Input maxlength",
    },
    readonly: {
      control: { type: "boolean" },
      description: "Readonly or not",
    },
    inputmode: {
      control: { type: "select" },
      options: ["none", "text", "tel", "url", "email", "numeric", "decimal", "search"],
      description: "Input inputmode",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BaseInput>;

const basicRender = (args: Args) => ({
  components: { BaseInput },
  setup() {
    const value = ref<string>("");

    return { args, value };
  },
  template: `<BaseInput v-bind="args" v-model="value" />`,
});

export const Basic: Story = {
  args: {
    small: true,
  },
  render: basicRender,
};

export const Number: Story = {
  args: {
    type: "number",
    small: true,
    inputmode: "decimal",
    placeholder: "Amount",
    max: 15,
  },
  render: basicRender,
};

export const WithLabel: Story = {
  args: {
    small: true,
    placeholder: "Enter email",
    label: "Email",
    type: "email",
  },
  render: (args: Args) => ({
    components: { BaseInput, BaseLabel },
    setup() {
      const value = ref<string>("");

      return { args, value };
    },
    template: `
      <BaseLabel forValue="email">Email</BaseLabel>
      <BaseInput v-bind="args" v-model="value" />
    `,
  }),
};

export const Error: Story = {
  args: {
    small: true,
    placeholder: "Some text",
    error: "Something wrong",
  },
  render: basicRender,
};
