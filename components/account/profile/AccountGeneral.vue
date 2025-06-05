<template>
  <CardUi in-content v-if="user">
    <div class="general">
      <div class="general-item">
        <LabelUI forValue="Email">
          {{ $t(`account.settings.general.email`) }}
        </LabelUI>
        <div class="d-flex gap-3">
          <div class="col-lg-6 flex-grow-1 flex-sm-grow-0">
            <InputUI
              v-if="user?.email"
              label="Email"
              placeholder="name@domain.com"
              v-model="user.email"
              disabled
              small
            />
          </div>
          <div class="col-lg-6" v-if="!user?.email_verified_at">
            <BaseButton type="button" @click="verifyYouEmail">
              {{ $t(`account.settings.verification.verifyBtn`) }}
            </BaseButton>
          </div>
          <div v-else class="col-6 general__verify">{{ $t(`account.settings.verification.isVerified.verified`) }}</div>
        </div>
        <div class="general-item__text">
          {{ $t(`account.settings.general.emailText`) }}
        </div>
      </div>

      <div class="general-item">
        <LabelUI forValue="Phone">
          {{ $t(`account.settings.general.phone`) }}
        </LabelUI>
        <div class="d-flex gap-3">
          <div class="col-lg-6 flex-grow-1 flex-sm-grow-0">
            <InputUI
              label="Phone"
              :placeholder="$t(`account.settings.verification.phonePlaceholder`)"
              v-model="user.phone_number"
              disabled
              small
              verified
            />
          </div>
          <div class="col-lg-6" v-if="!user?.phone_verified_at">
            <BaseButton type="button" @click="openPhoneModal">
              {{ $t(`account.settings.verification.addBtn`) }}
            </BaseButton>
          </div>
          <div v-else class="col-lg-6 general__verify">
            {{ $t(`account.settings.verification.isVerified.verified`) }}
          </div>
        </div>
        <div class="general-item__text">
          {{ $t(`account.settings.general.phoneText`) }}
        </div>
      </div>

      <hr />
    </div>

    <Modal v-model="isOpen" class="general__verify-dialog">
      <AccountModalVerifyPhone
        v-if="isPhone && (!userPhone || isChangePhone)"
        :user="user"
        @verifyNumber="verifyNumber"
        @cancel="closeModal"
        :custom-text="$t(`account.settings.verification.whatIsPhoneNumber`)"
      />

      <AccountModalVerifyCode
        v-else
        :user="user"
        :isPhone="isPhone"
        :resendIsDisabled="isPhone ? resendIsDisabled : resendIsDisabledEmail"
        @resend="resendCode"
        @send="sendCode"
        :reset="resetCode"
        @change-data="changeNumber"
      >
        {{ isPhone ? second : secondEmail }}
      </AccountModalVerifyCode>
    </Modal>
  </CardUi>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import LabelUI from "@/components/base/BaseLabel/BaseLabel.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import Modal from "@/components/base/BaseModal/BaseModal.vue";

import AccountModalVerifyCode from "@/components/account/profile/AccountModalVerifyCode.vue";
import AccountModalVerifyPhone from "@/components/account/profile/AccountModalVerifyPhone.vue";

import { useToast } from "@/library/vue-toast";
import { useUserStore } from "@/stores/userStore";

import services from "@/services/profile";
import servicesAuth from "@/services/auth";

import { User } from "@/types/profile";

import { useTimer } from "@/composition/useTimer";
import { cookieMeta, CookieMetaKeys } from "@/utils/constants";

const { resendTimer, resendIsDisabled, second } = useTimer();
const { resendTimer: resendTimerEmail, resendIsDisabled: resendIsDisabledEmail, second: secondEmail } = useTimer();

const { t } = useI18n();
const userStore = useUserStore();
const $toast = useToast();
const isPhone = ref(false);
const isChangePhone = ref(false);
const resetCode = ref(false);
const user = computed<User>(() => userStore.user);
const isOpen = ref(false);
const activeLanguage = ref(null);
const token = ref<string | null>(null);
const config = useRuntimeConfig();

const sentryEnv = config.public.SENTRY_ENV as CookieMetaKeys;
const tokenName = cookieMeta[sentryEnv].name;
const BearerToken = useCookie(tokenName).value;

if (BearerToken) {
  try {
    const user = await servicesAuth.middlewareLoginUser();
    await userStore.SET_USER(user);
  } catch (error) {}
}

await services.getListLanguage().then((response) => (activeLanguage.value = response.data));

const userPhone = computed<string>(() => user.value.phone_number);

const selectedLang = ref(user.value.language);

const verifyYouEmail = async () => {
  isPhone.value = false;
  if (!isOpen.value) {
    if (sessionStorage.getItem('resendToken')) {
      token.value = sessionStorage.getItem('resendToken')
    }

    await resendCode();
    isOpen.value = true;
  }
};

const changeNumber = () => {
  isChangePhone.value = true
};

const resendCode = async () => {
  try {
    if (isPhone.value) {
      if (resendIsDisabled.value) {
        return;
      }

      const res = await services.sendCodeOnPhone();
      if (res.data?.token) {
        sessionStorage.setItem('resendToken', res.data.token);
      }
      token.value = sessionStorage.getItem('resendToken');

      resendTimer(res.data?.available_in);
      return;
    } else {
      if (resendIsDisabledEmail.value) {
        return;
      }

      const res = await services.sendVerificatiOnEmail();
      if (res.data?.token) {
        sessionStorage.setItem('resendToken', res.data.token);
      }
      token.value = sessionStorage.getItem('resendToken');

      resendTimerEmail(res.data?.available_in);
      return;
    }
  } catch (error) {
    $toast.warning(error.response?.data?.message, { position: "top-right" });
  }
};

const verifyNumber = async (number) => {
  try {
    const phone = { phone_number: number.replaceAll(/[-]|[\s]/g, "") };

    if (userPhone.value !== phone.phone_number) {
      const { data: user } = await services.updatePhoneNumber(phone);
      await userStore.SET_USER(user);
      resendCode();
    }

    if (!isOpen.value) {
      isOpen.value = true;
    }
    if (!isPhone.value) {
      isPhone.value = true;
    }
    isChangePhone.value = false;
  } catch (error) {
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  }
};

const closeModal = () => {
  isOpen.value = !isOpen.value;
};

const updateUserProfile = async () => {
  try {
    const { data: user } = await services.getUserProfile();
    await userStore.SET_USER(user);
  } catch (error) {
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  }
};

const sendCode = async (code) => {
  try {
    if (isPhone.value) {
      await services.verificationPhoneWithCode({ code: code, token: token.value });
    } else {
      await services.confirmEmailByCode(code, token.value);
    }
    await updateUserProfile();
    closeModal();

    $toast.success(t("account.settings.verification.codeConfirmed"), { position: "top-right" });
    sessionStorage.removeItem('resendToken');
  } catch (error) {
    resetCode.value = !resetCode.value;
    console.log(error);
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  }
};

const openPhoneModal = async () => {
  isPhone.value = true;
  isOpen.value = true;

  if (userPhone.value && !isChangePhone.value) {
    resendCode()
  }
};

const saveUserLanguage = async () => {
  try {
    await services.updateLanguage({ language_id: selectedLang.value.id });
    $toast.success(t("account.settings.languageChanged"), { position: "top-right" });
  } catch (error) {
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  }
};
</script>

<style lang="scss" scoped>
.modal__verify {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.general {
  &-item {
    margin-bottom: 30px;
    &__text {
      margin-top: 9px;
      font-size: 15px;
      font-weight: 400;
      line-height: 145%;
      color: $color-grey;
    }
  }
}

.general__verify {
  display: flex;
  align-items: center;
  align-self: center;
  width: fit-content;
  height: fit-content;
  padding: 4px 8px;
  font-size: 12px;
  color: $color-green-light;
  border: 1px solid $color-green-light;
  border-radius: 4px;
}

:deep(.general__verify-dialog) {
  overflow: initial;
}
</style>
