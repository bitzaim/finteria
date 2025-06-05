<template>
  <CardUi in-content>
    <div class="verification">
      <div class="verification-item">
        <h4 class="verification__title verification__personal-data-title">
          {{ $t(`account.settings.verification.personalData`) }}
        </h4>
        <div class="row verification__personal-row">
          <div class="col-xl-4">
            <p class="verification__input-label">
              {{ $t(`account.settings.verification.name`) }}
            </p>
            <InputUI v-model="personalData.first_name" small :disabled="isPersonalData" />
          </div>
          <div class="col-xl-4">
            <div class="d-lg-none mt-2"></div>
            <p class="verification__input-label">
              {{ $t(`account.settings.verification.surname`) }}
            </p>
            <InputUI v-model="personalData.last_name" small :disabled="isPersonalData" />
          </div>
          <div v-if="!isPersonalData" class="col-xl-4 d-flex align-items-end mt-2 mt-xl-0">
            <BaseButton type="submit" @click="updatePersonalData">
              {{ $t("common.btns.save") }}
            </BaseButton>
          </div>
        </div>
        <div class="verification-item">
          {{ $t(`account.settings.verification.agreementSignInstruction`) }}
        </div>
      </div>
      <div>
        <h4 class="verification__title">
          {{ $t(`account.settings.verification.agreement`) }}
        </h4>
        <VerificationItem
          @openModal="openModal"
          :status="isVerified"
          :isActive="Boolean(user?.agreement_signed_at)"
          isSign
          :isDisabled="!isPersonalData"
        >
          <template #body>
            <a
              v-show="Boolean(user?.agreement_signed_at)"
              href="/"
              ref="$downloadLink"
              download
              class="verification__download color-primary fw-bold"
              @click.stop.prevent="getAgreementDocument"
            >
              {{ $t(`account.settings.verification.downloadAgreement`) }}
            </a>
          </template>
        </VerificationItem>
      </div>
      <BaseModal v-model="isOpen">
        <VerificationModal @save="saveSignature" />
      </BaseModal>

      <hr />
      <div class="verification-item">
        <h4 class="verification__title">
          {{ $t(`account.settings.verification.accountVerification`) }}
        </h4>

        <div class="verification__status" :class="{ hidden: !userStore.verification, [colorVerifiedStatus]: true }">
          {{ $t(`account.settings.verification.accountVerificationsStatus`) }}
          <div class="verification__status-icon">
            {{ isVerified }}
          </div>
        </div>

        <WarningNotification v-if="!userStore.user.first_deposited_at" class="verification__status">
          {{ $t(`account.wallets.walletsTab.withdrawal.unlockKYC`) }}
          <NuxtLink :to="{
            path: localePath(`/profile/trading`),
          }">
            {{ $t(`account.wallets.walletsTab.withdrawal.makeDeposit`) }}
          </NuxtLink>
        </WarningNotification>

        <div v-if="!isCompleted" class="verification__error-wrap">
          <div v-for="(error, index) in Object.keys(fileError)" class="verification__error" :key="`verify${index}`">
            <h3 class="verification__error-title">{{ error }}:</h3>
            <p class="verification__error-text">{{ fileError[error] }}</p>
          </div>
        </div>

        <template v-if="!isStatusAccepted">
          <p class="fw-bold">
            {{ $t(`account.settings.verification.chooseYourIdType`) }}
          </p>
          <BaseSelect
            :selectList="documentTypes"
            :selectedItem="state.id_type"
            :border="true"
            :placeholder="$t(`account.settings.verification.chooseYourIdType`)"
            :disabled="!userStore.user.first_deposited_at"
            class="verification__select mb-4"
            @update:selectedItem="changeSelectItem"
          />
        </template>
      </div>

      <hr />
      <div v-show="state.id_type?.value === 'passport'">
        <VerificationItem
          @update="updateKycData($event, 'passport')"
          :status="isVerified"
          :isActive="documentIsLoaded && isCompleted"
          :title="$t(`account.settings.verification.copyOfPassport`)"
          :is-disabled="!userStore.user.first_deposited_at"
        >
          <template #body>
            {{ $t(`account.settings.verification.uploadFileImg`) }}
          </template>
        </VerificationItem>
      </div>

      <div v-show="state.id_type?.value === 'card'">
        <VerificationItem
          @update="updateCardData($event, 0)"
          :status="isVerified"
          :isActive="documentIsLoaded && isCompleted"
          :title="$t(`account.settings.verification.frontSide`)"
          :is-disabled="!userStore.user.first_deposited_at"
        >
          <template #body>
            {{ $t(`account.settings.verification.uploadFileImg`) }}
          </template>
        </VerificationItem>
        <hr />
        <VerificationItem
          @update="updateCardData($event, 1)"
          :status="isVerified"
          :isActive="documentIsLoaded && isCompleted"
          :title="$t(`account.settings.verification.backSide`)"
          :is-disabled="!userStore.user.first_deposited_at"
        >
          <template #body>
            {{ $t(`account.settings.verification.uploadFileImg`) }}
          </template>
        </VerificationItem>
      </div>

      <hr />
      <VerificationItem
        @update="updateKycData($event, 'selfie')"
        :status="isVerified"
        :isActive="documentIsLoaded && isCompleted"
        :title="$t(`account.settings.verification.takeASelfie`)"
        :is-disabled="!userStore.user.first_deposited_at"
      >
        <template #body>
          {{ $t(`account.settings.verification.takeASelfieText`) }}
          <br /><br />
          {{ $t(`account.settings.verification.uploadFileImg`) }}
        </template>
      </VerificationItem>

      <hr />
      <BaseButton
        v-show="!documentIsLoaded || !isCompleted"
        class="mt-4"
        mobile-full-width
        :disabled="isDocumentNull || isLoading"
        @click="saveVerificationData"
        :is-loading="isLoading"
        type="submit"
      >
        {{ $t(`account.settings.verification.submitBtn`) }}
      </BaseButton>
    </div>
  </CardUi>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect/BaseSelect.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal/BaseModal.vue";

import VerificationItem from "@/components/account/profile/verification/VerificationItem.vue";
import VerificationModal from "@/components/account/profile/verification/VerificationSignModal.vue";
import WarningNotification from "@/components/account/WarningNotification.vue";

import services from "@/services/kyc";
import servicesUser from "@/services/profile";
import { useToast } from "@/library/vue-toast";
import { useUserStore } from "@/stores/userStore";
import { scrollToTop } from "~~/utils/dom";

import { User, PersonalData } from "@/types/profile";

const $toast = useToast();
const { t } = useI18n();
const userStore = useUserStore();
const $downloadLink = ref(null);
const isOpen = ref(false);

const fileError = computed(() => userStore.verification?.errors);
const user = computed<User>(() => userStore.user);
const isPersonalData = computed<boolean>(() => Boolean(user.value?.first_name) && Boolean(user.value?.last_name));

const personalData = reactive<PersonalData>({
  first_name: user.value.first_name,
  last_name: user.value.last_name,
});

const documentTypes = [
  { display_code: "Passport", value: "passport" },
  { display_code: "Card ID", value: "card" },
];
const isLoading = ref(false);

const state = reactive({
  id_type: documentTypes[0],
  passport: null,
  selfie: null,
  card: [],
});

const colorVerifiedStatus = computed(() => {
  if (userStore.verification?.status === "review") {
    return "verification__status_yellow";
  }
  if (userStore.verification?.status?.includes("accepted")) {
    return "verification__status_green";
  }
  return "";
});

const isStatusAccepted = computed(() => {
  return userStore.verification?.status?.includes("accepted")
})

const isVerified = computed(() => (userStore.verification?.status ? userStore.verification?.status : "Not Verified"));

const isCompleted = computed(() => isVerified.value !== "incomplete");

const documentIsLoaded = computed(() => isVerified.value !== "Not Verified");

const isDocumentNull = computed(() =>
  state.id_type?.value === "passport"
    ? Object.values(state).some((element) => element == null)
    : state.card.length !== 2
);

const updateUserProfile = async () => {
  try {
    const { data: user } = await servicesUser.getUserProfile();
    await userStore.SET_USER(user);
  } catch (error) {
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  }
};

const changeSelectItem = (event) => {
  state.id_type = event;
};

const updatePersonalData = async () => {
  try {
    const data = await services.updatePersonalData(personalData);
    await userStore.SET_USER(data);
    personalData.first_name = data.first_name;
    personalData.last_name = data.last_name;
    $toast.success(t("account.settings.dataUpdated"), { position: "top-right" });
    openModal();
  } catch (reqError) {
    if (reqError.data.errors) {
      return Object.values(reqError.data.errors).forEach((error) => $toast.warning(error, { position: "top-right" }));
    }
    return $toast.warning(reqError.data.message, { position: "top-right" });
  }
};

const getAgreementDocument = async () => {
  try {
    const documentReq: any = await services.getAgreementDocument();
    const url = window.URL.createObjectURL(documentReq);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    a.download = "agreement.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    return $toast.warning(t("account.settings.verification.toast.signatureNeeded"), { position: "top-right" });
  }
};

const updateKycData = (file, stateName) => {
  state[stateName] = file;
};

const updateCardData = (file, index) => {
  state.card.push(file);
};

const saveSignature = async (value) => {
  try {
    const signatureForm = new FormData();

    signatureForm.append("signature_image", value);

    await services.sendUserSignature(signatureForm);
    closeModal();
    updateUserProfile();
  } catch (reqError) {
    if (reqError.data.errors) {
      return Object.values(reqError.data.errors).forEach((error) => $toast.warning(error, { position: "top-right" }));
    }
    return $toast.warning(reqError.data.message, { position: "top-right" });
  }
};

// change to DRY
const saveVerificationData = async () => {
  if (!(personalData.first_name && personalData.last_name)) {
    $toast.warning(t("account.settings.verification.toast.dataRequired"), {
      position: "top-right",
    });
    return;
  }

  if (!isDocumentNull.value) {
    try {
      isLoading.value = true;
      let data;
      const formData = new FormData();
      formData.append("id_type", state.id_type.value);
      if (state.id_type.value === "passport") {
        formData.append("passport", state.passport);
        formData.append("selfie", state.selfie);
      } else {
        formData.append("card[]", state.card[0]);
        formData.append("card[]", state.card[1]);
        formData.append("selfie", state.selfie);
      }
      if (userStore.verification?.status) {
        formData.append("_method", "patch");
        data = await services.verificationUser(formData).then((response) => response.data);
      } else {
        data = await services.verificationUser(formData).then((response) => response.data);
      }
      userStore.SET_VERIFICATION(data);
      updateUserProfile();
      $toast.success(t("account.settings.verification.toast.dataSent"), { position: "top-right" });
      scrollToTop();
    } catch (reqError) {
      if (reqError.data.errors) {
        return Object.values(reqError.data.errors).forEach((error) => $toast.warning(error, { position: "top-right" }));
      }
      return $toast.warning(reqError.data.message, { position: "top-right" });
    } finally {
      isLoading.value = false;
    }
  }
};

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const getStatusValue = async () => {
  if (userStore.verification) {
    return;
  }

  try {
    const serverData = await services.getVerificationRequest();
    // if (serverData.data.value) {
    if (serverData.data) {
      userStore.SET_VERIFICATION(serverData.data);
      const findType =
        documentTypes.find((element) => element.value === userStore.verification?.id_type) ?? documentTypes[0];
      state.id_type = findType;
    }
  } catch (reqError) {
    if (reqError.data.errors) {
      return Object.values(reqError.data.errors).forEach((error) => $toast.warning(error, { position: "top-right" }));
    }
    return $toast.warning(reqError.data.message, { position: "top-right" });
  }
};
getStatusValue();
</script>

<style scoped lang="scss">
.verification {
  &__status {
    display: flex;
    justify-content: space-between;
    width: 60%;
    padding: 10px 15px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
    line-height: 145%;
    background: $color-bg-status;
    border-radius: 4px;
    @include media-breakpoint-down("lg") {
      align-items: center;
      width: 100%;
      font-size: 12px;
    }
    &-icon {
      padding: 3px 8px;
      font-size: 12px;
      font-weight: 500;
      line-height: 100%;
      color: $color-grey;
      text-transform: capitalize;
      background: $color-white;
      border: 2px solid $color-orange-dark;
      border-radius: 2px;
    }
  }
  &__notice-icon {
    margin-top: -3px;
  }
  &__title {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 24px;
    font-weight: 400;
  }
  &__personal-data-title {
    margin-top: 0;
  }
  &__input-label {
    margin-bottom: 5px;
  }
  &__select {
    width: 40%;
    @include media-breakpoint-down("lg") {
      width: 100%;
    }
  }
  &__personal-row {
    width: 100%;
  }
}

.verification__status_yellow {
  background: rgba($color-orange, 40%);
  & .verification__status-icon {
    border: 2px solid $color-orange;
  }
}

.verification__status_green {
  background: rgba($color-green-light, 40%);
  & .verification__status-icon {
    border: 2px solid $color-green-light;
  }
}

.verification__download {
  font-size: 16px;
}

.verification__error-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: fit-content;
  padding: 10px;
  margin-bottom: 20px;
  background: $color-bg-status;
  border-radius: 4px;
}
.verification__error {
  display: flex;
  align-items: center;
}

.verification__error-title {
  font-size: 16px;
  text-transform: capitalize;
}

.verification__error-text {
  margin-left: 6px;
  line-height: 1;
}

.verification-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.hidden {
  visibility: hidden;
}
</style>
