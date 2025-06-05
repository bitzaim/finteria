export default defineNuxtRouteMiddleware((to, from) => {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
});
