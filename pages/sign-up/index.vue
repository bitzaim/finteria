<template>
  <LandingAuth>
    <template #title>{{ $t("signUp.title") }}</template>
    <template #subtitle>{{ $t("signUp.subtitle") }}</template>

    <SignUpForm :detectedCountry="detectedCountry" />

    <template #rightSide>
      <SignUpInfo />
    </template>
  </LandingAuth>
</template>

<script setup>
import LandingAuth from "@/components/auth/LandingAuth.vue";
import SignUpInfo from "@/components/auth/SignUpInfo.vue";
import SignUpForm from "@/components/auth/SignUpForm.vue";
import { scrollToTop } from "~~/utils/dom";

definePageMeta({
  middleware: "redirect-profile-room",
});

defineProps(["detectedCountry"]);

onBeforeMount(() => {
  scrollToTop();
});
</script>
