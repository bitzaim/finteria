import VueTelInput from "vue-tel-input";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueTelInput);
});
