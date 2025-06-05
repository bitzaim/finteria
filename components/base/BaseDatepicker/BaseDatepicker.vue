<template>
  <Datepicker
    v-model="date"
    class="datepicker"
    :enableTimePicker="false"
    :range="range"
    :format="format"
    :placeholder="placeholder"
    autoApply
  >
    <template #input-icon>
      <IconCalendar class="datepicker__calendar" />
    </template>
  </Datepicker>
</template>

<script setup lang="ts">
import Datepicker from "@vuepic/vue-datepicker";
import IconCalendar from "@/components/icons/IconCalendar.vue";
import type { Props, Emits } from "./BaseDatepicker.type";

import "@vuepic/vue-datepicker/dist/main.css";

const props = withDefaults(defineProps<Props>(), {
  range: false,
});

const emit = defineEmits<Emits>();

const date = computed<Date | Date[] | null>({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const format = (date: Date | Date[]) => {
  if (Array.isArray(date)) {
    const day = date[0].getDate();
    const month = date[0].getMonth() + 1;
    const year = date[0].getFullYear();
    const day2 = date[1].getDate();
    const month2 = date[1].getMonth() + 1;
    const year2 = date[1].getFullYear();

    return `${day}.${month}.${year} - ${day2}.${month2}.${year2}`;
  } else {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
};

const dateNow = new Date();
const placeholder = computed<string>(() => {
  if (props.range) {
    const prevDate = new Date();
    prevDate.setDate(dateNow.getDate() - 7);

    const day = prevDate.getDate();
    const month = prevDate.getMonth() + 1;
    const year = prevDate.getFullYear();
    const day2 = dateNow.getDate();
    const month2 = dateNow.getMonth() + 1;
    const year2 = dateNow.getFullYear();

    return `${day}.${month}.${year} - ${day2}.${month2}.${year2}`;
  }

  const day = dateNow.getDate();
  const month = dateNow.getMonth() + 1;
  const year = dateNow.getFullYear();

  return `${day}.${month}.${year}`;
});
</script>

<style scoped lang="scss">
.datepicker:deep(.dp__input) {
  min-height: 45px;
}

.datepicker__calendar {
  margin-left: 8px;
}
</style>
