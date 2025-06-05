<template>
  <div>
    <Html class="page" :lang="head.htmlAttrs.lang" dir="auto">
      <Head>
        <Title>{{ title }}</Title>
        <Meta name="description" :content="description" />
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
      </Head>
      <Body class="page__body">
        <div class="wrap" v-show="isLoading">
          <Header />
          <NuxtLoadingIndicator />

          <NuxtPage />

          <Footer />
        </div>
      </Body>
    </Html>
  </div>
</template>

<script setup>
import Header from "@/layouts/Header.vue";
const Footer = defineAsyncComponent(() => import("@/layouts/Footer.vue"));

import { useUserStore } from "@/stores/userStore";
import { setCookie, getCookie } from "@/utils/utilsCookies";
import { COOKIE_LANGUAGE } from '@/constants/i18n';

const isLoading = ref(false);
const i18n = useI18n();
const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
await userStore.FETCH_MIN_AMOUNT();

onMounted(() => {
  try {
    const browserLanguage = i18n.getBrowserLocale();
    const findBrowserLanguage = i18n.availableLocales.includes(browserLanguage);
    const defaultLanguage = findBrowserLanguage ? browserLanguage : "en";

    let choosedLocale;
    if (getCookie(COOKIE_LANGUAGE)) {
      choosedLocale = getCookie(COOKIE_LANGUAGE);
    } else {
      choosedLocale = defaultLanguage;
      setCookie(COOKIE_LANGUAGE, defaultLanguage, { expires: 'Fri, 31 Dec 9999 23:59:59 GMT', });
    }

    const switchLocalePath = useSwitchLocalePath();
    const fullPath = route.fullPath;
    const langInPath = fullPath.split("/")?.[1];

    // LOGIC: if we detect language in path => then we switch language to it and change cookie
    if (langInPath && i18n.availableLocales.includes(langInPath)) {
      switchLocalePath(langInPath);
      setCookie(COOKIE_LANGUAGE, langInPath, { expires: 'Fri, 31 Dec 9999 23:59:59 GMT', });
      choosedLocale = langInPath;
    }

    if (choosedLocale) {
      router.replace({ path: switchLocalePath(choosedLocale), query: { ...route.query } });
    }
  } catch (error) {
    console.log("error when init language", error);
  } finally {
    isLoading.value = true;
  }
});

onMounted(() => {
  if (route.hash) {
    const section = document.getElementById(route.hash.slice(1));
    const position = section.getBoundingClientRect().top;

    window.scrollTo({
      top: position,
    });
  }
});

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});
const title = computed(() => i18n.t("trade.meta.title"));
const description = computed(() => i18n.t("trade.meta.description"));
</script>

<style scoped lang="scss">
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
