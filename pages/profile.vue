<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import profile from "@/services/profile";
import { useToast } from "@/library/vue-toast";
import { useWebsockets } from "@/composition/useWebsockets";
import { getCookie, deleteCookie } from "@/utils/utilsCookies";

const $toast = useToast();
const { t } = useI18n();
const disconnect = useWebsockets([]);

onMounted(async () => {
  const promocode = getCookie("promocodeUntilRegistration");
  if (promocode) {
    try {
      const res = await profile.applyPromocode(promocode);
      if (res.data?.length) {
        res.data.forEach((gift) => {
          $toast.gift(gift.message, { position: "top-right", queue: true });
        });
      } else {
        $toast.gift(t("signUp.promoCodeApplied").replace("XXX", promocode), { position: "top-right" });
      }
    } catch (error) {
      $toast.warning(error?.response?._data?.message || t("signUp.wrongPromoCode"), { position: "top-right" });
    } finally {

      deleteCookie("promocodeUntilRegistration");
    }
  }
});

onUnmounted(() => {
  disconnect();
});
</script>
