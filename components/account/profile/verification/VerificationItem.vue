<template>
  <div class="verification-item">
    <p v-show="title" class="fw-bold">
      {{ title }}
    </p>

    <div class="row w-100">
      <div class="col verification-item__text">
        <slot name="body" />
      </div>
      <div class="verification-item__notice">
        <img v-if="!isSign" :src="currentImgSrc" alt="signed" class="verification-item__icon" />
        <img v-if="isSign && isActive" src="/img/base/success.svg" alt="signed" class="verification-item__icon" />

        <div class="small-text" v-show="isSign && isActive">
          {{ $t(`account.settings.verification.signed`) }}
        </div>
        <p v-if="isAccepted && !isSign" class="verification-item__status">
          {{ $t(`account.settings.verification.isVerified.verified`) }}
        </p>
        <div v-else>
          <div class="small-text" v-show="isActive && !isSign">
            {{ $t(`account.settings.verification.onVerification`) }}
          </div>
          <div class="small-text" v-show="file && !isActive && !isSign">
            {{ $t(`account.settings.verification.loaded`) }}
          </div>
          <div class="small-text" v-show="!file && !isActive && !isSign">
            {{ $t(`account.settings.verification.notLoaded`) }}
          </div>
        </div>
      </div>
    </div>
    <button
      class="button button_outline"
      :class="{ kyc__label_disabled: isDisabled }"
      :disabled="isDisabled"
      v-show="isSign && !isActive"
      @click="openModal"
    >
      <b>{{ buttonText }}</b>
    </button>

    <label class="button button_outline" :class="{ kyc__label_disabled: isDisabled }" v-show="!isSign && !isActive">
      <p>{{ buttonText }}</p>
      <input type="file" hidden @change="updateFile" :disabled="isDisabled" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { useToast } from "@/library/vue-toast";
import { getFileExtension } from "@/utils/getFileExtansion";

const $toast = useToast();
const props = defineProps<{
  status: string;
  isActive?: boolean;
  isSign?: boolean;
  title?: string;
  isDisabled?: boolean;
}>();
const emits = defineEmits<{
  (e: "update", value: any): void;
  (e: "openModal"): void;
}>();

const { t } = useI18n();
const file = ref(null);
const acceptFiles = [".png", ".pdf", ".jpg", ".jpeg", ".heic", ".heif"];
const maxSize = 10240000; // почти 10 MB согласование с бэком
const isAccepted = computed(() => props.status === "accepted");
let outterQuality = 1; // 0.1 - 1

// const currentText = computed(() => {
//   if (props.isSign) {
//     return t(`account.settings.verification.signed`);
//   }
//   if (props.isActive) {
//     return t(`account.settings.verification.onVerification`);
//   }
//   return file.value
//     ? t(`account.settings.verification.loaded`)
//     : t(`account.settings.verification.notLoaded`);
// });

const buttonText = computed(() => {
  return props.isSign ? t(`account.settings.verification.uploadSign`) : t(`account.settings.verification.uploadFile`);
});

const updateFile = async (event) => {
  if (!event.target.files[0]) return;
  const extension = getFileExtension(event.target.files[0].name);

  if (event.target.files[0].size > maxSize) {
    $toast.warning(t("account.settings.verification.toast.fileSize"), { position: "top-right" });
    return;
  }

  if (acceptFiles.includes(`.${extension}`)) {
    file.value = event.target.files[0];
    emits("update", event.target.files[0]);
  } else {
    $toast.warning(t("account.settings.verification.toast.fileFormat"), { position: "top-right" });
  }
};

const openModal = () => {
  emits("openModal");
};

const currentImgSrc = computed(() =>
  props.isActive || file.value ? "/img/base/success.svg" : "/img/base/warning.svg"
);
</script>

<style scoped lang="scss">
@import "~/assets/style/include.scss";

.verification-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.verification-item__icon {
  width: 16px;
  height: 16px;
}

.verification-item__notice {
  display: flex;
  gap: 6px;
  align-items: center;
  width: fit-content;
}

.verification-item__text {
  font-size: 16px;
}

.verification-item__status {
  text-transform: capitalize;
}

.kyc__label {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 700;
  color: $color-primary;
  cursor: pointer;
  border: 2px solid $color-orange;
  border-radius: 2px;
  transition: background $transition-time;

  &:hover {
    background: $color-orange;
  }
}

.kyc__label_disabled {
  color: $color-white;
  cursor: not-allowed;
  background-color: $color-btn-disable;
  border: 2px solid $color-btn-disable;

  &:hover {
    background: $color-btn-disable;
  }
}
</style>
