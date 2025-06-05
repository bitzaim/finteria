<template>
  <LandingAuth>
    <template #title>{{ $t("login.reset") }}</template>
    <template #default>
      <form class="d-flex flex-column gap-4" @submit.prevent="resetPassword">
        <div v-if="queryToken" class="d-flex flex-column gap-3">
          <div>
            <div class="login__input">
              <LabelUI forValue="Password">
                {{ $t("login.inputs.newPassword") }}
              </LabelUI>
              <InputUI
                v-model="newPasswordData.password"
                label="Password"
                placeholder="********"
                type="password"
                :error="passwordError"
              />
            </div>
          </div>

          <div>
            <div class="login__input my-2">
              <LabelUI forValue="ResetPassword">
                {{ $t("login.inputs.confirmPassword") }}
              </LabelUI>
              <InputUI
                v-model="newPasswordData.password_confirmation"
                label="ResetPassword"
                placeholder="********"
                type="password"
                :error="confirmPasswordError"
              />
            </div>
          </div>
        </div>

        <div v-else>
          <div class="login__input">
            <LabelUI forValue="E-mail">
              {{ $t("login.inputs.email.label") }}
            </LabelUI>
            <InputUI label="E-mail" placeholder="name@domain.com" v-model.trim="resetEmail.email" :error="emailError" />
          </div>
        </div>

        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <button class="button button_yellow" type="submit">
            {{ $t(`login.buttonReset`) }}
          </button>
          <NuxtLink :to="localePath(path.auth.signUp)">
            <p class="login-link">
              {{ $t("login.footer") }}
            </p>
          </NuxtLink>
        </div>
      </form>
    </template>
    <template #rightSide>
      <CompanyInfo />
    </template>
  </LandingAuth>
</template>

<script setup>
import { useToast } from "@/library/vue-toast";

import { path } from "@/constants/routes";

import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

import LandingAuth from "@/components/auth/LandingAuth.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import LabelUI from "@/components/base/BaseLabel/BaseLabel.vue";

import CompanyInfo from "@/components/auth/CompanyInfo.vue";

import services from "@/services/auth";

useHead({
  meta: {
    name: "robots",
    content: "noindex, nofollow",
  },
});

const route = useRoute();

function getCookie(string) {
  if (string) {
    let matches = string.match(new RegExp("email".replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  return undefined;
}

const { t } = useI18n();
const localePath = useLocalePath();

const $toast = useToast();

const queryToken = computed(() => route.query?.token);
const queryEmail = computed(() => {
  if (route.href) {
    return getCookie(route.href)
  }

  let reg = new RegExp('[?&]email=([^&#]*)', 'i');
  let queryString = reg.exec(route.fullPath);

  return queryString ? queryString[1] : route.query?.email
});

const resetEmail = reactive({
  email: "",
});

const newPasswordData = reactive({
  token: queryToken.value,
  email: queryEmail.value,
  password: "",
  password_confirmation: "",
  _method: "patch",
});

const identyPassword = (value) => value === newPasswordData.password;

const rules = computed(() =>
  queryToken.value
    ? {
        password: { required, minLengthValue: minLength(6) },
        password_confirmation: {
          required,
          minLengthValue: minLength(6),
          identyPassword,
        },
      }
    : {
        email: {
          required,
          email,
        },
      }
);

const validateData = computed(() => (queryToken.value ? newPasswordData : resetEmail));

const v$ = useVuelidate(rules.value, validateData);

const emailError = computed(() => (v$.value.email.$error ? t("signUp.inputs.email.postfix") : ""));

const passwordError = computed(() => (v$.value.password.$error ? t("signUp.inputs.password.postfix") : ""));

const confirmPasswordError = computed(() => {
  if (v$.value.password_confirmation.$errors[0]?.$validator === "identyPassword") {
    return t("signUp.inputs.password.identy");
  }
  if (v$.value.password_confirmation.$error) {
    return t("signUp.inputs.password.postfix");
  }
  return "";
});

const sendNewPassword = async () => {
  try {
    console.log(newPasswordData)
    await services.resetPasswordNewData(newPasswordData);

    navigateTo(localePath(path.auth.login));
    $toast.success(t("login.toastSuccessNewpassword"), { position: "top-right" });
  } catch (reqError) {
    if (reqError.data.errors) {
      return Object.values(reqError.data.errors).forEach((error) => $toast.warning(error, { position: "top-right" }));
    }
    return $toast.warning(reqError.data.message, { position: "top-right" });
  }
};

const sendResetLinkOnEmail = async () => {
  try {
    await services.resetPassword(resetEmail);
    $toast.success(t("login.toastSuccessReset"), { position: "top-right" });
    v$.value.$reset();
    resetEmail.email = "";
  } catch (reqError) {
    if (reqError.data.errors) {
      return Object.values(reqError.data.errors).forEach((error) => $toast.warning(error, { position: "top-right" }));
    }
    return $toast.warning(reqError.data.message, { position: "top-right" });
  }
};

const resetPassword = async () => {
  const isValidate = await v$.value.$validate();
  console.log(v$.value);
  if (isValidate) {
    if (queryToken.value) {
      sendNewPassword();
    } else {
      sendResetLinkOnEmail();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/include.scss";

.login__link {
  margin: 0px;
  color: $color-primary;
  text-align: right;

  @include media-breakpoint-down("md") {
    max-width: 140px;
  }
}

.login__input {
  width: 100%;
}

.input-label-postfix {
  font-size: 12px;
  font-weight: 400;
  line-height: 140%;
  color: $color-primary;
  cursor: pointer;

  @include media-breakpoint-down("md") {
    font-size: 9px;
    line-height: 130%;
  }
}

.login-link {
  color: $color-primary;
  &:hover {
    color: $color-black;
  }
}
</style>
