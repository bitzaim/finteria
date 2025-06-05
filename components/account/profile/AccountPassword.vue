<template>
  <CardUi in-content>
    <p>{{ $t(`account.settings.password.paragraph`) }}</p>

    <div class="d-lg-none mt-3"></div>

    <div class="password-wrap">
      <PasswordItem :passwordValue="state.current_password" @updateInput="inputPassword($event, 'current_password')">
        <template #title>{{ $t(`account.settings.password.currentPassword`) }}</template>
      </PasswordItem>

      <PasswordItem
        :passwordValue="state.password"
        @updateInput="inputPassword($event, 'password')"
        :error="checkPasswordError"
      >
        <template #title>{{ $t(`account.settings.password.newPassword`) }}</template>
      </PasswordItem>

      <PasswordItem
        :passwordValue="state.password_confirmation"
        @updateInput="inputPassword($event, 'password_confirmation')"
        :error="checkPasswordError"
      >
        <template #title>{{ $t(`account.settings.password.confirmNewPassword`) }}</template>
      </PasswordItem>

      <hr />
      <BaseButton mobile-full-width type="button" :disabled="!checkPassword" @click="updatePassword">
        {{ $t(`account.settings.password.changePasswordBtn`) }}
      </BaseButton>
    </div>
  </CardUi>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";

import PasswordItem from "./password/PasswordItem.vue";

import { useToast } from "@/library/vue-toast";
import services from "@/services/profile";

const $toast = useToast();
const { t } = useI18n();

const state = reactive({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const checkPassword = computed(() => state.password === state.password_confirmation && state.password.length > 0);
const checkPasswordError = computed<string | null>(() => {
  if (!checkPassword.value && state.password.length !== 0) {
    return t("account.settings.password.comparePasswordError")
  }

  return null;
})

const updatePassword = async () => {
  try {
    await services.updatePassword(state);
    $toast.success(t("account.settings.password.passwordSuccess"), { position: "top-right" });
    Object.keys(state).forEach((element) => (state[element] = ""));
  } catch (reqError) {
    if (reqError.data.errors) {
      return Object.values(reqError.data.errors).forEach((error) => $toast.warning(error, { position: "top-right" }));
    }
    return $toast.warning(reqError.data.message, { position: "top-right" });
  }
};

const inputPassword = (event: string, stateName: any) => {
  state[stateName] = event;
};
</script>

<style scoped lang="scss">
.password-wrap {
  margin-top: 30px;
  &__item {
    margin-bottom: 30px;
  }
}

.password__btn {
  position: absolute;
  top: 50%;
  right: 20px;
  color: $color-btn-disable;
  transition: color $transition-time;
  transform: translateY(-50%);
  &:hover {
    color: $color-primary;
  }
}
</style>
