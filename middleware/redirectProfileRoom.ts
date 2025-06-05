// редирект авторизовонного пользователя на личный кабинет
import { useUserStore } from "@/stores/userStore";
import { path } from "~~/constants/routes";
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (userStore.$state.user) {
    if (to.query?.platform) {
      if (to.query.platform === "default") {
        redirectToDefaultProfilePlatform({}, false);
      } else {
        const [profileGroup, profileCurrency] = (to.query.platform as string).split("/");
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
    return useRuntimeConfig().SHOW_PROFILE ? path.account.trading : '/';
  } else if ((from.path === path.auth.login || from.path === path.auth.signUp) && from.query.next && !to.query.next) {
    return `${to.path}?next=${from.query.next}`;
  } else {
    return "";
  }
});
