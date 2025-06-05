<template>
  <div class="accordion__item">
    <button class="accordion__btn" :class="{ accordion__btn_active: isActive }" type="button" @click="togglerAccordion">
      <div class="accordion__icon-wrap">
        <IconArrow class="accordion__icon" />
      </div>
      {{ $rt(item.title) }}
    </button>
    <TransitionCollapse>
      <p class="accordion__item-drop" v-show="isActive">
        {{ $rt(item.text, { m$sg: userStore.minFirstAmount || 10 }) }}
      </p>
    </TransitionCollapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TransitionCollapse from "@/components/TransitionCollapse.vue";
import IconArrow from "@/components/icons/IconArrow.vue";
import { useUserStore } from "~~/stores/userStore";
defineProps<{ item: any; withoutBorder?: boolean }>();

const userStore = useUserStore();

const isActive = ref<boolean>(false);

const togglerAccordion = () => {
  isActive.value = !isActive.value;
};
</script>

<style scoped lang="scss">
.accordion__item {
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 1px solid rgba($color-text-dark, 20%);
}

.accordion__btn {
  display: flex;
  gap: 30px;
  align-items: center;
  width: 100%;
  font-size: 24px;
  font-weight: 700;
  text-align: left;
  @include media-breakpoint-down("sm") {
    font-size: 16px;
    line-height: 140%;
  }
}

.accordion__icon-wrap {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 8px;
  background: $color-orange-dark;
}

.accordion__icon {
  width: 100%;
  color: $color-white;
  transition: transform $transition-time;
}

.accordion__btn_active .accordion__icon {
  transform: rotate(180deg);
}

.accordion__btn_active .accordion__icon-wrap {
  background: $color-orange;
}

.accordion__item-drop {
  margin-left: 60px;
  white-space: pre-line;
}
</style>
