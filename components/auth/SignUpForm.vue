<template>
  <form class="form__signUp" @submit.prevent="onValidate">
    <div>
      <BaseLabel forValue="E-mail">
        {{ $t("signUp.inputs.email.label") }}
      </BaseLabel>
      <BaseInput label="E-mail" placeholder="name@domain.com" v-model.trim="registerForm.email" :error="emailError" />
    </div>
    <div>
      <BaseLabel forValue="Password">
        {{ $t("signUp.inputs.password.label") }}
        <span class="input-label-postfix">
          {{ $t("signUp.inputs.password.postfix") }}
        </span>
      </BaseLabel>

      <BaseInput
        label="Password"
        placeholder="********"
        type="password"
        :error="passwordError"
        v-model="registerForm.password"
      />
    </div>
    <vueRecaptcha
      ref="recaptcha"
      size="invisible"
      :sitekey="siteKey"
      @verify="sendSignUpForm"
      @expired="onCaptchaExpired"
      @error="onError"
    ></vueRecaptcha>
    <div class="checkbox-container">
      <CheckboxUI v-model="registerForm.termesOfUseAgreement" :error="termesOfUseAgreementError">
        <p class="agreement">
          {{ $t("signUp.inputs.termsAgreement.prefix") }}
        </p>
      </CheckboxUI>
    </div>

    <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
      <button class="button button_yellow" :disabled="isFetching">
        <BaseLoader v-if="isFetching" inline with-text />
        <span v-else>{{ $t(`signUp.button`) }}</span>
      </button>

      <NuxtLink :to="localePath('/login')" class="auth__link">
        {{ $t("signUp.footer") }}
      </NuxtLink>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

import vueRecaptcha from "vue3-recaptcha2";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useToast } from "@/library/vue-toast";

import { useUserStore } from "@/stores/userStore";
import BaseLabel from "@/components/base/BaseLabel/BaseLabel.vue";
import BaseInput from "@/components/base/BaseInput/BaseInput.vue";
import CheckboxUI from "@/components/base/BaseCheckbox/BaseCheckbox.vue";

import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";

import services from "@/services/auth";

import { setCookie } from "@/utils/utilsCookies";
import { scrollToTop } from "~~/utils/dom";
import { path } from "~~/constants/routes";
import { getCookie } from "@/utils/utilsCookies";
import { cookieMeta } from "@/utils/constants";
import { useDomain } from "@/composition/useDomain";

const config = useRuntimeConfig();
const localePath = useLocalePath();
const { t } = useI18n();
const userStore = useUserStore();
const $toast = useToast();
const { optionsPlatformURL } = useDomain();

const registerForm = reactive({
  email: "",
  password: "",
  recaptcha_token: "asd123",
  click_hash: null, // required if typein is null
  typein: null, // google | default
  termesOfUseAgreement: false,
});

const recaptcha = ref(null);
const isFetching = ref(false);
const siteKey = config.public.SITE_KEY;
const route = useRoute();

onMounted(() => {
  if (getCookie("clickid")) {
    registerForm.click_hash = getCookie("clickid");
    delete registerForm.typein;
  } else if (getCookie("utm_source")) {
    delete registerForm.click_hash;
    registerForm.typein = "google";
  }
});
const rules = {
  password: { required, minLengthValue: minLength(6) },
  termesOfUseAgreement: {
    checked: (value) => value === true,
  },
  email: {
    required,
    email,
  },
};

const v$ = useVuelidate(rules, registerForm);

const emailError = computed(() => (v$.value.email.$error ? t("signUp.inputs.email.postfix") : ""));

const passwordError = computed(() => (v$.value.password.$error ? t("signUp.inputs.password.postfix") : ""));

const termesOfUseAgreementError = computed(() => (v$.value.termesOfUseAgreement.$error ? "Required" : ""));

const onValidate = async () => {
  const isValidate = await v$.value.$validate();
  if (isValidate) {
    isFetching.value = true;
    recaptcha.value.execute();
  }
};

const onCaptchaExpired = () => {
  recaptcha.value.reset();
};

const onError = () => {
  $toast.warning(t("signUp.toast.recaptchaFailed"), { position: "top-right" });
  isFetching.value = false;
};

const sendSignUpForm = async (response) => {
  registerForm.recaptcha_token = response;
  try {
    const { user, token } = await services.postRegisterUser(registerForm).then((response) => response.data);

    await userStore.SET_USER(user);
    const sentryEnv = config.public.SENTRY_ENV;
    const tokenName = cookieMeta[sentryEnv].name;
    const domain = cookieMeta[sentryEnv].domain();
    if (domain) {
      setCookie(tokenName, token, { "max-age": 86400, domain: domain });
      await navigateTo(`${optionsPlatformURL.value}redirect?userID=${user.id}`, { external: true });
    } else {
      setCookie(tokenName, token, { "max-age": 86400 });
      if (route.query.next) {
        navigateTo({ path: localePath(route.query.next) });
      } else {
        await navigateTo(`${optionsPlatformURL.value}redirect?userID=${user.id}`, { external: true });
      }
      scrollToTop();
    }
  } catch (error) {
    $toast.warning(error.response?.data?.message, { position: "top-right" });
  }

  isFetching.value = false;
};
</script>

<style lang="scss" scoped>
.form__signUp {
  display: grid;
  gap: 22px;
}

.input-label-postfix {
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;

  @media (max-width: 767px) {
    font-size: 9px;
    line-height: 130%;
  }
}

.agreement {
  display: inline;
  font-size: 12px;
}

.checkbox-container {
  display: grid;
  gap: 16px;
}

.agreement__link {
  color: $color-link-secondary;

  &:hover {
    text-decoration: underline;
  }
}

.auth__link {
  color: $color-link;
  &:hover {
    color: $color-link-hover;
  }
}
</style>
