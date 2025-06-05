<template>
  <LandingAuth v-if="access">
    <template #title>{{ $t("login.title") }}</template>
    <template #default>
      <form class="d-flex flex-column gap-4" @submit.prevent="loginUser">
        <div class="login__input">
          <LabelUI forValue="E-mail">
            {{ $t("login.inputs.email.label") }}
          </LabelUI>
          <InputUI label="E-mail" placeholder="name@domain.com" v-model.trim="loginForm.email" :error="emailError" />
        </div>
        <div class="login__input">
          <LabelUI forValue="Password">
            {{ $t("login.inputs.password.label") }}

            <NuxtLink :to="localePath('/reset')" class="input-label-postfix">{{
              $t("login.inputs.password.postfix")
            }}</NuxtLink>
          </LabelUI>
          <InputUI
            v-model="loginForm.password"
            label="Password"
            placeholder="********"
            type="password"
            :error="passwordError"
          />
        </div>

        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <button class="button button_yellow" :disabled="fetching">
            <BaseLoader v-if="fetching" inline with-text />
            <span v-else>
              {{ $t(`login.button`) }}
            </span>
          </button>
          <NuxtLink :to="localePath(path.auth.signUp)">
            <p>
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
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

import LandingAuth from "@/components/auth/LandingAuth.vue";
import InputUI from "@/components/base/BaseInput/BaseInput.vue";
import LabelUI from "@/components/base/BaseLabel/BaseLabel.vue";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";

import CompanyInfo from "@/components/auth/CompanyInfo.vue";

import services from "@/services/auth";

import { useUserStore } from "@/stores/userStore";
import { setCookie } from "@/utils/utilsCookies";
import { scrollToTop } from "@/utils/dom";
import { cookieMeta } from "@/utils/constants";

const { t } = useI18n();
const localePath = useLocalePath();

const userStore = useUserStore();
const $toast = useToast();
const route = useRoute();

definePageMeta({
  middleware: ["redirect-profile-room"],
});

const loginForm = reactive({
  email: "",
  password: "",
});

const rules = {
  password: { required, minLengthValue: minLength(6) },
  email: {
    required,
    email,
  },
};

const v$ = useVuelidate(rules, loginForm);
const config = useRuntimeConfig();
const emailError = computed(() => (v$.value.email.$error ? t("signUp.inputs.email.postfix") : ""));
const sentryEnv = config.public.SENTRY_ENV;
const tokenName = cookieMeta[sentryEnv].name;
const passwordError = computed(() => (v$.value.password.$error ? t("signUp.inputs.password.postfix") : ""));
const { optionsPlatformURL } = useDomain();

const fetching = ref(false);
const loginUser = async () => {
  const isValidate = await v$.value.$validate();

  if (isValidate) {
    try {
      fetching.value = true;
      const { user, token } = await services.postUserLoginData(loginForm).then((response) => response.data);

      await userStore.SET_USER(user);
      setCookie(tokenName, token, { "max-age": 86400 });

      if (route.query?.platform) {
        if (route.query.platform === "default") {
          redirectToDefaultProfilePlatform({}, false);
        } else {
          const [profileGroup, profileCurrency] = route.query.platform.split("/");
          console.log(profileGroup, profileCurrency);
          if (profileGroup && profileCurrency) {
            redirectToDefaultProfilePlatform({ deposit: profileCurrency, group: profileGroup }, false);
          } else {
            if (profileGroup && !profileCurrency) {
              redirectToDefaultProfilePlatform({ mock: true }, false);
            }
          }
        }
        return;
      }

      if (route.query.next) {
        navigateTo(route.query.next);
      }

      if (!useRuntimeConfig().public.SHOW_PROFILE) {
        navigateTo(`${optionsPlatformURL.value}redirect?userID=${user.id}`, { external: true });
      }

      $toast.success(t("login.welcome"), { position: "top-right" });
      scrollToTop();
    } catch (error) {
      if (error.response?.status === 403) {
        throw createError({ statusCode: 403, statusMessage: t("common.errors.403"), fatal: true });
      }
      $toast.warning(error.response?.data?.message, { position: "top-right" });
    } finally {
      fetching.value = false;
    }
  }
};
const access = ref(false);
onMounted(async () => {
  // Проверка query на редирект платформы
  if (route.query?.platform && userStore.isAuth) {
    if (route.query.platform === "default") {
      redirectToDefaultProfilePlatform({ platform_type: "options" }, false);
    } else {
      const [profileGroup, profileCurrency] = route.query.platform.split("/");
      redirectToDefaultProfilePlatform(
        { currency: profileCurrency, group: profileGroup, platform_type: "options" },
        false
      );
    }
  }
  // Проверка query на редирект профиля
  await redirectFromLanding();
  // Проверка query на для отоброжении страницы
  if ((!route.query?.platform && !route.query?.token) || !userStore.isAuth) access.value = true;
});
async function redirectFromLanding() {
  if (route.query?.token) {
    try {
      const response = await fetch(atob(route.query?.token));
      const { data } = await response.json();
      await userStore.SET_USER(data.user);
      setCookie(tokenName, data.token, { "max-age": 86400 });
      $toast.success(t("login.welcome"), { position: "top-right" });
      if (useRuntimeConfig().public.SHOW_PROFILE) {
        navigateTo({ path: localePath(path.account.trading), query: { delay: 2000 } });
      }
    } catch {
      $toast.warning(error.response?.data?.message, { position: "top-right" });
    } finally {
      fetching.value = false;
    }
  }
}
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
  cursor: pointer;

  @include media-breakpoint-down("md") {
    font-size: 9px;
    line-height: 130%;
  }
}
</style>
