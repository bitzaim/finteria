<script setup>
import Withdrawal from "@/components/account/trading/Withdrawal.vue";

definePageMeta({
  validate: () => {
    return useRuntimeConfig().public.SHOW_PROFILE
  }
})
</script>

<template>
  <Withdrawal />
</template>
