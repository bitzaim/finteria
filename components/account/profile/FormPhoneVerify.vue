<script setup lang="ts">
import { ref } from "vue";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";
import { User } from "@/types/profile";

const props = withDefaults(
  defineProps<{
    user: User;
    customText?: string;
    customTitle?: string;
    hideButtons?: boolean;
  }>(),
  {
    hideButtons: false,
  }
);

const phone = ref(props.user.phone_number);
const phoneIsValid = ref();

const options = {
  showDialCodeInList: true,
  showFlags: true,
  showSearchBox: true,
};

const inputOptions = {
  inputOptions: "on",
  showDialCode: true,
  autofocus: true,
  type: "tel",
};

const emit = defineEmits<{
  (event: "verifyNumber", value: string): void;
  (event: "cancel"): void;
  (event: "validateInput", value: boolean): void;
}>();

const validateInput = (event) => {
  phoneIsValid.value = event.valid;
  // if buttons are hidden gave to parent boolean for validation purpose
  if (props.hideButtons) {
    emit("validateInput", event.valid);
  }
};

const verfifyNumber = () => {
  emit("verifyNumber", phone.value);
};

defineExpose({ phone });
</script>

<template>
  <form @submit.prevent="verfifyNumber">
    <VueTelInput
      v-model="phone"
      class="modal__input"
      :inputOptions="inputOptions"
      :dropdownOptions="options"
      :mode="'international'"
      :validCharactersOnly="true"
      @validate="validateInput"
      :class="{ error: !phoneIsValid }"
    />
    <template v-if="!props.hideButtons">
      <button class="button button_yellow button_small mt-4" :disabled="!phoneIsValid" type="submit">
        {{ $t("common.btns.continue") }}
      </button>
      <button class="button button_outline secondary m-4 mb-0" type="button" @click="emit('cancel')">
        {{ $t("common.btns.cancel") }}
      </button>
    </template>
  </form>
</template>

<style lang="scss" scoped>
.modal__input {
  width: fit-content;
}

.error {
  border: 1px solid red;
}
</style>
