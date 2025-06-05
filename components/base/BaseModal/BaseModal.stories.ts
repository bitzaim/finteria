import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "../BaseButton/BaseButton.vue";
import BaseModal from "./BaseModal.vue";

const meta: Meta<typeof BaseModal> = {
  title: "Base/Dialog",
  component: BaseModal,
  tags: ["autodocs"],
  argTypes: {
    persistable: { control: "boolean", description: "If value is `true` - can't close" },
    preventClickOutside: { control: "boolean", description: "If value is `true` - can't close with click outside" },
  },
};

export default meta;
type Story = StoryObj<typeof BaseModal>;

export const Basic: Story = {
  render: (args) => ({
    components: { BaseButton, BaseModal },
    setup() {
      const isOpen = ref<boolean>(false);

      return { isOpen, args };
    },
    template: `
      <BaseButton color="primary" @click="isOpen = true">Open dialog</BaseButton>
      <BaseModal v-model="isOpen" v-bind="args">
        <h2>Dialog title</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          It has survived not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </BaseModal>
    `,
  }),
};
