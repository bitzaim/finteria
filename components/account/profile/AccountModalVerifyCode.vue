<template>
  <div class="modal__verify">
    <h2 class="modal__title">{{ currentTitle }}</h2>
    <p>
      {{ `${$t("account.settings.verification.enterCode")} ${currentText}` }}.
      <span class="modal__change-data" v-if="props.isPhone" @click="changeData">{{
        $t("account.settings.general.changePhone")
      }}</span>
    </p>
    <BaseInput
      class="modal__input"
      :maska="{ data: '######' }"
      v-model="inputData"
      @keypress="validateWholeNumbers"
      :maxlength="6"
      @paste="handlePaste"
      inputmode="numeric"
    />
    <p>
      {{ $t("account.settings.verification.didReceiveCode") }}
      <button
        @click="resend"
        class="color-primary button_resend"
        :class="{ gray: resendIsDisabled }"
        :disabled="resendIsDisabled"
      >
        {{ $t("common.btns.resend") }}
        <span v-if="resendIsDisabled"><slot></slot></span>
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { User } from "@/types/profile";
import BaseInput from "@/components/base/BaseInput/BaseInput.vue";
import { validateWholeNumbers } from "@/utils/processNumbers";

const props = defineProps<{
  user: User;
  isPhone?: boolean;
  resendIsDisabled: boolean;
  reset: boolean;
}>();
const { t } = useI18n();
const inputData = ref("");
const cellsCount = 6;
const emits = defineEmits<{
  (event: "send", value: any): void;
  (event: "resend"): void;
  (event: "change-data"): void;
  (event: "mounted"): void;
}>();

const currentTitle = computed(() =>
  props.isPhone ? t("account.settings.verification.verifyPhone") : t("account.settings.verification.verifyEmail")
);

const currentText = computed(() => (props.isPhone ? props.user.phone_number : props.user.email));

const sendCode = (event: string): void => {
  emits("send", event);
};

const resend = (): void => {
  emits("resend");
};

const changeData = (): void => {
  emits("change-data");
};

const handlePaste = async (e) => {
  // const copyData = await navigator.clipboard.readText();
  const copyData =
    e.clipboardData && e.clipboardData.getData
      ? e.clipboardData.getData("text/plain") // Standard
      : window.clipboardData && window.clipboardData.getData
      ? window.clipboardData.getData("Text") // MS
      : false;

  if (!copyData) {
    alert("Couldn't paste code");
  }

  const itContainsNaN = Array.from(copyData).some((char) => isNaN(Number(char)));
  if (itContainsNaN) {
    e?.preventDefault();
    return false;
  }
};

watch(
  () => inputData.value,
  () => {
    if (inputData.value.length === cellsCount) {
      sendCode(inputData.value);
    }
  }
);

watch(
  () => props.reset,
  (value) => {
    inputData.value = "";
  }
);

onMounted(() => {
  emits("mounted");
});
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

.modal__input {
  width: 200px;
}

.modal__change-data {
  color: $color-link;
  cursor: pointer;
  &:hover {
    color: $color-link-hover;
  }

  &.gray {
    color: $color-disable-dark;
    cursor: not-allowed;
  }
}
.button_resend {
  &:disabled {
    cursor: not-allowed;
  }

  &.gray {
    color: $color-disable-dark;
  }
}

.error {
  border: 1px solid red;
}
</style>
