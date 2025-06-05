<script setup>
import { useToast } from "@/library/vue-toast";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput/BaseInput.vue";
import { useUserStore } from "@/stores/userStore";
import FormPhoneVerify from "@/components/account/profile/FormPhoneVerify.vue";
import profile from "@/services/profile";

const emits = defineEmits(["close", "continue"]);
const $toast = useToast();
const $formPhoneVerify = ref(null);
const userStore = useUserStore();
const cardData = reactive({
  number: "",
  name: "",
  expiration: "",
  cvv2: "",
});

const step = ref(1);
const isPhoneVerified = computed(() => userStore.user?.phone_number && userStore.user?.phone_verified_at);
const phoneIsValid = ref(false);
const user = computed(() => userStore.user);

const process = (val) => {
  const splitted = val.split("/");
  if (Number(splitted[0]) > 12) {
    splitted[0] = 12;
    return splitted.join("/");
  }
  if (splitted?.[1]) {
    const currentYear = `${new Date().getFullYear()}`.slice(2);
    if (splitted[1].length === 2 && splitted[1] < currentYear) {
      splitted[1] = currentYear;
      return splitted.join("/");
    }
  }
  return val;
};

const disabled = computed(() => {
  if (cardData.number.length < 19) {
    return true;
  } else if (!cardData.name) {
    return true;
  } else if (cardData.expiration.length < 5) {
    return true;
  } else if (cardData.cvv2.length < 3) {
    return true;
  } else if (!isPhoneVerified.value && !phoneIsValid.value) {
    return true;
  } else {
    return false;
  }
});

async function handleContinue() {
  try {
    if (!isPhoneVerified.value) {
      const newPhone = $formPhoneVerify.value?.phone?.replaceAll(/[-]|[\s]/g, "");
      if (newPhone !== user.value.phone_number) {
        await verifyNumber(newPhone);
      }
    }
    step.value++;

    setTimeout(() => {
      step.value++;
    }, 3000);

    setTimeout(() => {
      emits("continue");
    }, 6000);
  } catch (error) {
    $toast.warning(error.response?._data?.message, { position: "top-right" });
  }
}

async function verifyNumber(number) {
  try {
    const phone = { phone_number: number.replaceAll(/[-]|[\s]/g, "") };
    const { data: user } = await profile.updatePhoneNumber(phone);
    await userStore.SET_USER(user);
  } catch (error) {
    throw error;
  }
}
</script>

<template>
  <div class="wrapper">
    <template v-if="step === 1">
      <h1 class="modal__title">{{ $t(`account.trading.depositWithModal.paymentCard.title`) }}</h1>
      <div class="card">
        <div class="card-icons">
          <img src="/img/payment/visa1.png" alt="visa" class="me-2" height="20" draggable="false" />
          <img src="/img/payment/mastercard1.png" alt="mastercard" height="20" draggable="false" />
        </div>
        <div class="card-data">
          <BaseInput
            :maska="{ data: '####! ####! ####! ####' }"
            small
            placeholder="0000 0000 0000 0000"
            v-model="cardData.number"
            inputmode="numeric"
          />
          <BaseInput
            :maska="{
              data: 'A A',
              tokens: 'A:[ЁёА-яA-Z]:multiple',
              options: {
                preProcess: (val) => val.toUpperCase(),
              },
            }"
            small
            :placeholder="$t(`account.trading.depositWithModal.paymentCard.cardholderName`)"
            v-model="cardData.name"
          />
        </div>
        <div class="card-verbose">
          <div>
            <span>MM/YY</span>
            <BaseInput
              :maska="{ data: '##/##', options: { postProcess: process } }"
              small
              placeholder="--/--"
              v-model="cardData.expiration"
              inputmode="numeric"
            />
          </div>
          <div>
            <span>CVV</span>
            <BaseInput :maska="{ data: '###' }" small placeholder="..." v-model="cardData.cvv2" inputmode="numeric" />
          </div>
        </div>
      </div>
      <div v-if="!isPhoneVerified">
        <p class="mb-2">{{ $t("account.settings.verification.phonePlaceholder") }}</p>
        <FormPhoneVerify :user="user" hide-buttons @validate-input="phoneIsValid = $event" ref="$formPhoneVerify" />
      </div>
      <div class="buttons">
        <BaseButton type="button" color="tertiary" @click="emits('close')">
          {{ $t(`account.trading.depositWithModal.paymentCard.backBtn`) }}
        </BaseButton>
        <BaseButton type="button" @click="handleContinue" id="card-continue" :disabled="disabled">
          {{ $t(`account.trading.depositWithModal.paymentCard.continueBtn`) }}
        </BaseButton>
      </div>
    </template>
    <template v-else-if="step === 2">
      <h1 class="modal__title">{{ $t(`account.trading.depositWithModal.paymentCard.title`) }}</h1>
      <BaseLoader />
      <p class="modal__text">{{ $t("account.trading.depositWithModal.paymentCard.processing") }}</p>
    </template>
    <template v-else-if="step === 3">
      <h1 class="modal__title">{{ $t(`account.trading.depositWithModal.paymentCard.title`) }}</h1>
      <BaseLoader />
      <p class="modal__text">{{ $t("account.trading.depositWithModal.paymentCard.processingFailed") }}</p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: auto;
}
.card {
  height: 0;
  padding-right: 20px;
  padding-bottom: 56.25%;
  padding-left: 20px;
  background: linear-gradient(180deg, #4d80d6 0%, #2756a5 100%);
  border-radius: 30px;
  @include media-breakpoint-down("sm") {
    height: max-content;
    padding-bottom: 10px;
  }
  &-icons {
    padding: 20px 0;
    text-align: right;
    @include media-breakpoint-down("sm") {
      padding: 10px 0;
    }
  }
  &-data {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 50%;
    @include media-breakpoint-down("sm") {
      gap: 5px;
      width: 80%;
    }
  }
  &-verbose {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    @include media-breakpoint-down("sm") {
      margin-top: 5px;
    }
    & > div {
      width: 20%;
      @include media-breakpoint-down("sm") {
        width: 40%;
      }
      & > span {
        @include media-breakpoint-down("sm") {
          font-size: 12px;
        }
        opacity: 0.8;
      }
      & > div {
        margin-top: 5px;
      }
    }
  }
}

.buttons {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid $color-disable-light;
}

.modal__title {
  font-size: 24px;
  font-weight: 400;
  @include media-breakpoint-down("sm") {
    font-size: 16px;
  }
}

.modal__text {
  font-weight: bold;
  text-align: center;
  @include media-breakpoint-down("sm") {
    font-size: 14px;
  }
}
</style>
