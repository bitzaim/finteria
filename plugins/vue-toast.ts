import { useToast } from "@/library/vue-toast";

export default defineNuxtPlugin(({ vueApp }) => {
  const $toast = useToast();

  // @ts-ignore
  vueApp.use($toast);
});

// export default defineNuxtPlugin((nuxtApp) => {
//   const $toast = useToast();
//   // @ts-ignore
//   nuxtApp.vueApp.use($toast, {
//     // property: {
//     //   id: 'GA_MEASUREMENT_ID'
//     // }
//     position: "top"
//   })
// })
