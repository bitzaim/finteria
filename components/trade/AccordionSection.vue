<template>
  <section class="block_blue">
    <div class="container accordion">
      <div class="accordion__left">
        <h2 class="title">{{ $t(`${props.sectionSlug}.helpCenter.title`) }}</h2>
        <p class="subtitle">
          {{ $t(`${props.sectionSlug}.helpCenter.text`) }}
        </p>
        <button class="button button_yellow" @click="handleClick" href="#">
          {{ $t(`${props.sectionSlug}.helpCenter.buttonText`) }}
        </button>
      </div>
      <div class="accordion__right">
        <AccordionItem v-for="(item, index) in array" :key="`accordionItem${index}`" :item="item" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AccordionItem from "@/components/trade/AccordionItem.vue";

const { tm } = useI18n();

const props = defineProps({
  sectionSlug: {
    type: String, // trade | exchange | borrow
    default: "trade",
  },
});

//@ts-ignore
const array: [] = computed(() => tm(`${props.sectionSlug}.helpCenter.accordions`) || []);

function handleClick() {
  jivo_api?.open();
}
</script>

<style scoped lang="scss">
.accordion {
  display: flex;
  gap: 20px;

  justify-content: space-between;
  padding-top: 120px;
  padding-bottom: 120px;

  @include media-breakpoint-down("xl") {
    flex-direction: column;
    gap: 40px;
  }
}

.accordion__left {
  display: grid;
  gap: 30px;
  justify-items: flex-start;
  max-width: 520px;
  height: fit-content;

  @include media-breakpoint-down("xl") {
    max-width: inherit;
  }
}

.accordion__right {
  width: 100%;
  max-width: 630px;
  @include media-breakpoint-down("xl") {
    max-width: inherit;
  }
}
</style>
