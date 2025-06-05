<template>
  <div class="modal__verify">
    <h2 class="modal__title">{{ customTitle || $t("account.settings.verification.verifyPhone") }}</h2>
    <p class="modal__subtitle">{{ customText }}</p>
    <FormPhoneVerify :user="props.user" @verifyNumber="verfifyNumber" @cancel="$emit('cancel')" />
  </div>
</template>

<script setup lang="ts">
import FormPhoneVerify from "./FormPhoneVerify.vue";
import { User } from "@/types/profile";

const props = defineProps<{ user: User; customText?: string; customTitle?: string }>();

const emit = defineEmits<{
  (event: "verifyNumber", value: string): void;
  (event: "cancel"): void;
}>();

const verfifyNumber = (phone: string) => {
  emit("verifyNumber", phone);
};
</script>

<style scoped lang="scss">
.modal__verify {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal__title {
  font-size: 24px;
  font-weight: 400;
}

.modal__subtitle {
  font-size: 18px;
  font-weight: 800;
}
</style>
