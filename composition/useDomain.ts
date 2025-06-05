import { useGlobals } from "@/stores/globals";

export const useDomain = () => {
  const globalStore = useGlobals();
  const optionsPlatformURL = ref<string>(globalStore.optionsPlatformURL)

  const GUIDES_URL = 'https://guides.finteria.com/finteria-help-center/';

  onBeforeMount(() => {
    optionsPlatformURL.value = ''
    setTimeout(() => {
      optionsPlatformURL.value = globalStore.optionsPlatformURL
    }, 0)
  })

  return {
    optionsPlatformURL,
    GUIDES_URL
  }
}
