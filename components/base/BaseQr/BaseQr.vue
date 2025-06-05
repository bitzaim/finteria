<template>
  <qrcode-vue v-if="value && value.length" :value="value" :size="size" level="H" />
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import type { Props } from "./BaseQr.type";
import { useWindowSize } from "@vueuse/core";

defineProps<Props>();

const { width } = useWindowSize();

const size = computed<number>(() => (width.value > 767 ? 243 : 180));
</script>
