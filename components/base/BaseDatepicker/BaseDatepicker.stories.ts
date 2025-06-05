import type { Meta, StoryObj, Args } from "@storybook/vue3";

import BaseDatePicker from "./BaseDatePicker.vue";

const meta: Meta<typeof BaseDatePicker> = {
  title: "Base/Datepicker",
  component: BaseDatePicker,
  tags: ["autodocs"],
  argTypes: {
    range: { control: { type: "boolean" }, description: "Range date or not" },
  },
};

export default meta;
type Story = StoryObj<typeof BaseDatePicker>;

const basicRender = (args: Args) => ({
  components: { BaseDatePicker },
  setup() {
    const date = ref<Date | Date[] | null>(null);

    return { args, date };
  },
  template: `<BaseDatePicker v-model="date" v-bind="args">{{ args.default }}</BaseDatePicker>`,
});

export const Basic: Story = {
  render: basicRender,
};
