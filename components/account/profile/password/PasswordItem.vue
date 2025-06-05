<template>
  <div class="password-wrap__item">
    <LabelUI forValue="Current Password">
      <slot name="title"></slot>
    </LabelUI>
    <div class="row">
      <div class="col-sm-6 position-relative">
        <input
          placeholder="******"
          class="password__input"
          :class="{
            'password__input_error': !!error
          }"
          :value="passwordValue"
          :type="typeOfInput"
          @input="handleInput"
        />
        <button class="password__btn" type="button" @click="changePasswordType">
          <IconEye class="password__icon" />
        </button>
      </div>
      <p v-if="!!error" class="password__error">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from "vue";

import LabelUI from "@/components/base/BaseLabel/BaseLabel.vue";

import IconEye from "@/components/icons/IconEye.vue";

const props = defineProps<{ passwordValue?: string, error?: string }>();
const emits = defineEmits<{ (e: "updateInput", value: string): void }>();

const isView = ref(false);
const passwordValue = toRef(props, "passwordValue");

const typeOfInput = computed(() => (isView.value ? "text" : "password"));

const changePasswordType = () => {
  isView.value = !isView.value;
};

const handleInput = (event: any) => {
  emits("updateInput", event.target.value);
};
</script>

<style scoped lang="scss">
.password__btn {
  position: absolute;
  top: 50%;
  right: 40px;
  display: flex;
  align-items: center;
  color: $color-btn-disable;
  transition: color $transition-time;
  transform: translateY(-50%);
  &:hover {
    color: $color-primary;
  }
}

.password__input {
  width: 100%;
  max-width: 420px;
  padding: 7px 10px;
  border: 1px solid $color-disable-light;
  border-radius: 4px;
}

.password__input_error {
  border-color: $color-danger-light;
}

.password__error {
  margin: 0;
  margin-top: 5px;
  color: $color-danger-light;
}
</style>
