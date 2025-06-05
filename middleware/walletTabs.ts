export default defineNuxtRouteMiddleware((to, from) => {
  if (to.fullPath.includes("/profile/wallets") && !Object.getOwnPropertyNames(to.query).length) {
    return `${to.fullPath}?action=wallets`;
  }
  return "";
});
