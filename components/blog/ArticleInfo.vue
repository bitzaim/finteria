<template>
  <p class="article-info">
    <time class="article-info__date" :datetime="publishedAt || ''">
      {{ publishedAtFormatted }}
    </time>

    <span v-if="categories && categories.length" class="article-info__category">
      {{ categories[0].name }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { Category } from "~~/services/types/blog.type";

const props = defineProps<{
  publishedAt: string | null;
  categories: Category[] | null;
}>();

const i18n = useI18n();

const publishedAtFormatted = computed<string>(() => {
  if (props.publishedAt) {
    return formatDateShort(props.publishedAt, i18n.locale.value);
  }

  return "";
});
</script>

<style scoped lang="scss">
.article-info {
  display: flex;
  justify-content: space-between;
  margin: 0;
}

.article-info__date,
.article-info__category {
  position: relative;
  padding-left: 25px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;

  @include media-breakpoint-up("md") {
    font-size: 14px;
  }
}

.article-info__date {
  color: $color-grey;
}

.article-info__category {
  color: $color-primary-hover;
}

.article-info__date::before,
.article-info__category::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 16px;
  height: 16px;
  content: "";
  transform: translateY(-50%);
}

.article-info__date::before {
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 2H13.3334V0.666625C13.3334 0.298719 13.0347 0 12.6666 0H12C11.632 0 11.3334 0.298719 11.3334 0.666625V2H4.66663V0.666625C4.66663 0.298719 4.36803 0 4 0H3.33337C2.96534 0 2.66663 0.298719 2.66663 0.666625V2H2C0.897344 2 0 2.89734 0 4V14C0 15.1027 0.897344 16 2 16H14C15.1027 16 16 15.1027 16 14V4C16 2.89734 15.1027 2 14 2ZM14.6666 14C14.6666 14.3673 14.3673 14.6666 14 14.6666H2C1.63269 14.6666 1.33337 14.3673 1.33337 14V6.69334H14.6666V14Z' fill='%235D94F1'/%3E%3C/svg%3E%0A");
}

.article-info__category::before {
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.6666 0H9.12485C8.75825 0 8.24587 0.212384 7.98685 0.471213L0.389089 8.06901C-0.129696 8.58722 -0.129696 9.43683 0.389089 9.95441L6.04624 15.6114C6.56385 16.1296 7.41264 16.1296 7.93103 15.6108L15.5288 8.01421C15.7876 7.75542 16 7.24221 16 6.87639V1.3334C16 0.600197 15.3998 0 14.6666 0ZM11.9998 5.33342C11.2634 5.33342 10.6664 4.7358 10.6664 4.00001C10.6664 3.26302 11.2634 2.66661 11.9998 2.66661C12.7362 2.66661 13.3334 3.26302 13.3334 4.00001C13.3334 4.7358 12.7362 5.33342 11.9998 5.33342Z' fill='%23FBC920'/%3E%3C/svg%3E%0A");
}
</style>
