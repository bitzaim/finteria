import { useGlobals } from "@/stores/globals";
import { replaceWithCurrentTld } from "@/utils/helpers";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:beforeMount", () => {
    const config = useRuntimeConfig();
    const globals = useGlobals();
    globals.SET_HREF(window.location.href);

    config.public.PLATFORM_URL = replaceWithCurrentTld(config.public.PLATFORM_URL);
  });
});
