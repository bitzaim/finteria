<template>
  <label class="checkbox" :class="{ checkbox_disabled: disabled, checkbox_error: error }">
    <input
      class="checkbox__input"
      :checked="modelValue"
      @change="updateModelValue"
      :disabled="disabled"
      type="checkbox"
    />

    <span class="checkbox__text">
      <slot />
    </span>

    <span v-if="error && error.length" class="checkbox__error">{{ error }}</span>
  </label>
</template>

<script setup lang="ts">
import type { Props, Emits } from "./BaseCheckbox.type";

withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<Emits>();

const updateModelValue = (event: Event) => {
  if (event.target) {
    emit("update:modelValue", (event.target as HTMLInputElement).checked);
  }
};
</script>

<style lang="scss" scoped>
.checkbox {
  cursor: pointer;
}

.checkbox_disabled {
  cursor: not-allowed;
}

.checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(100%);
  border: 0;
}

.checkbox__text {
  display: flex;
  gap: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: $color-grey;
}

.checkbox__text::before {
  box-sizing: border-box;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  content: "";
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid $color-border-pre-dark;
  border-radius: 4px;
}

.checkbox_error .checkbox__text::before {
  border-color: $color-danger-light;
}

.checkbox__input:checked + .checkbox__text::before {
  background-color: $color-orange-dark;
  background-image: url("/img/base/check.svg");
  border: none;
}

.checkbox__input:disabled + .checkbox__text::before {
  cursor: not-allowed;
  background-color: $color-white-secondary;
  background-image: url("/img/base/check.svg");
  border: none;
}

.checkbox__input:focus + .checkbox__text::before {
  border-color: $color-orange-dark;
}

.checkbox__input:checked:focus + .checkbox__text::before {
  border: 1px solid $color-black;
}

.checkbox__error {
  margin-left: 26px;
  font-size: 12px;
  color: $color-danger-light;
}
</style>
