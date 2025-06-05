<template>
  <div>Redirect...</div>
  <span>message:{{ messageEvent }}</span>
</template>

<script setup lang="ts">
const messageEvent = ref("");

onMounted(() => {
  window.addEventListener("message", (event) => {
    messageEvent.value = JSON.stringify(event);
  });
});
</script>
