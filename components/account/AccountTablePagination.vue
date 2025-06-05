<template>
  <div v-if="meta" class="container">
    <div class="row justify-content-center justify-content-md-between">
      <div class="col-auto">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <button class="page-link" type="button" aria-label="Previous" @click="updatePage(1)">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="page-item" v-for="page in pages" :key="`pagination${page}`">
              <button
                class="page-link"
                :class="{ active: meta.current_page === page }"
                @click="updatePage(page)"
                type="button"
              >
                {{ page }}
              </button>
            </li>
            <li class="page-item">
              <button class="page-link" aria-label="Next" type="button" @click="updatePage(meta.last_page)">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div class="col-12 d-md-none"></div>

      <div class="col-auto mb-3">{{ meta.from }}-{{ meta.to }} of {{ meta.total }} items</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ meta?: any }>();

const emits = defineEmits<{ (e: "update", value: number): void }>();

const pages = computed(() => {
  const maxPageLimit = 5;
  const pagesArr = [];
  const negativePages = props.meta.current_page - 1;
  let negativeCount = 2;

  if (negativePages) {
    for (let i = negativePages; negativeCount > 0 && i > 0; i--) {
      pagesArr.unshift(i);
      negativeCount--;
    }
  }

  for (let i = props.meta.current_page; pagesArr.length < maxPageLimit && i <= props.meta.last_page; i++) {
    pagesArr.push(i);
  }
  return pagesArr;
});

const updatePage = (page: number) => {
  emits("update", page);
};
</script>
