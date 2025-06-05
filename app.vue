<script setup>
import savePromocode from "@/utils/savePromocode";
import { saveClickId, saveUtmSource } from "@/utils/saveClickIdAndUtmSource";

savePromocode();
saveClickId();
saveUtmSource();
</script>

<template>
  <div class="layout">
    <NuxtLayout />
  </div>
</template>
