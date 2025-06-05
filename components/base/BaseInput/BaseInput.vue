<template>
  <div
    class="input-ui-container"
    :class="{
      'input-ui-container_small': small,
      'input-ui-container_copy': copy,
    }"
  >
    <div v-if="max" class="input-ui-container__max">
      <button class="input-ui-container__set-max" type="button" @click="onInputValue(String(max))">Max</button>
      <button class="input-ui-container__set-min" type="button" @click="emit('update:modelValue', '0')">
        <IconCloseInput />
      </button>
    </div>

    <input
      v-if="maska"
      ref="input"
      v-maska:[maska?.options]
      :data-maska="maska?.data"
      :data-maska-tokens="maska?.tokens"
      :id="label"
      class="input-ui-container__input"
      :class="{
        'input-ui-container__input_error': !!error,
        'input-ui-container__input_small': small,
        'input-ui-container__input_text-right': max || textRight,
      }"
      v-model="localValue"
      :inputmode="inputmode"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
      :maxlength="maxlength"
      :min="min"
    />

    <input
      v-else
      ref="input"
      class="input-ui-container__input"
      :class="{
        'input-ui-container__input_error': !!error,
        'input-ui-container__input_small': small,
        'input-ui-container__input_text-right': max || textRight,
      }"
      v-model="localValue"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
      :maxlength="maxlength"
      :min="min"
    />

    <button
      v-if="copy"
      class="input-ui-container__copy"
      type="button"
      @click="copyValue('input')"
      title="Copy to clipboard"
    />

    <p v-if="error" class="input-ui-container__input_error input-ui-container__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Props, Emits } from "./BaseInput.type";
import { vMaska } from "maska";
import { useToast } from "@/library/vue-toast";
import IconCloseInput from "@/components/icons/IconCloseInput.vue";

const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  disabled: false,
  placeholder: "",
  error: "",
  small: false,
  textRight: false,
  readonly: false,
  copy: false,
});

const toast = useToast();
const { t } = useI18n();

const instance = getCurrentInstance();
const input = ref<HTMLInputElement>();

defineExpose({
  input,
});

const onInputValue = (val: string | number | null) => {
  val = String(val);
  if (props.type === "number") {
    val = val.replace(",", ".");
  }

  emit("update:modelValue", val);
  instance?.proxy?.$forceUpdate();
};

const localValue = computed<string | number | null>({
  get() {
    return props.modelValue;
  },
  set(value) {
    onInputValue(value);
  },
});

const copyValue = (val: string) => {
  eval(val).value.select();
  document.execCommand("copy");
  toast.success(t("common.btns.copied"), {
    position: "top-right",
  });
};
</script>

<style scoped lang="scss">
.input-ui {
  @include media-breakpoint-down("md") {
    height: 36px;
    font-size: 13px;
    line-height: 18.2px;
  }
}

.input-ui-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 50px;
}

.input-ui-container_small {
  min-height: 42px;

  @include media-breakpoint-up("sm") {
    min-height: 44px;
  }
}

.input-ui-container__max {
  position: absolute;
  top: 50%;
  left: 14px;
  display: flex;
  align-items: center;
  background-color: $color-white;
  transform: translateY(-50%);
}

.input-ui-container__set-max {
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  color: $color-orange-dark;
  text-transform: uppercase;
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.input-ui-container__set-min {
  padding: 0;
  margin-left: 8px;
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.input-ui-container__input {
  flex-grow: 1;
  flex-shrink: 0;
  height: 100%;
  padding: 0 14px;
  font-size: 16px;
  line-height: 22.4px;
  border: $color-border-pre-dark 1px solid;
  border-radius: 4px;
  outline: none;
}

.input-ui-container__input_error {
  border-color: $color-danger-light;
}

.input-ui-container__error {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  margin: 0px;
  font-size: 12px;
  color: $color-danger-light;
}

.input-ui-container__input:disabled {
  background-color: $color-disable;
}

.input-ui-container__input::placeholder {
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 145%;
  color: $color-head-light;
}

.input-ui-container__input::-webkit-outer-spin-button,
.input-ui-container__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-ui-container__input[type="number"] {
  -moz-appearance: textfield;
}

.input-ui-container__input_text-right {
  text-align: right;
}

.input-ui-container_copy .input-ui-container__input {
  padding-right: 40px;
}

.input-ui-container__copy {
  position: absolute;
  top: 50%;
  right: 10px;
  width: 20px;
  height: 20px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABdElEQVR4nO2ZTUoDQRCFPxBGD+APiCaexYyeQa/gBfQKegBNEDxAbiEGvYQax+BC3EQ3LhxoGahA0ShiT/eQIfVBL9KB11U9rxJ4A4ZhLDQ7wACYACXgaqxSdPpAt4ni94GPmkW7X9Y7kKe++VTFO9VEJ1UDA3XQI7ALZDU1M6AHjJX2BYmYqEOq4mPSU9pFLNFVYKg+64Gte/M+mTfYtdkAHkRwhvZqClxM/asfxFrVwFvbG3DWwP9x9gQUZqEAnFlIYRYKwJmFFGahAJxZSGEWCsCZhRRmoQCcWeiP22hVKlEqwSXZe06YC+VK+ymG4IsS3JS9vtoby6Exkrk9L5k7j1A/N0rwQPa6kl2mzEansbLREyVaNTMjT9jEVCLGKGwDn0r8SH3XkcdcRHo/UIhe9FT6TB305TXRClaAO+/GRsAhsKV+neaadeA24dAOm2hiGTj1ZiLGupcIvzGqwT4GruV/InSAX4FLYK3J4g3DYH74BiVuxlAKb+m8AAAAAElFTkSuQmCC");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px;
  transform: translateY(-50%);
}
</style>
