import { defineStore } from "pinia";
import { Category } from "~~/services/types/blog.type";
import { getCategoriesList } from "@/services/blog";

export type BlogState = {
  categories: Category[] | null;
};

export const useBlogStore = () => {
  const innerStore = defineStore("blog", {
    state: () =>
      ({
        categories: [],
      } as BlogState),

    actions: {
      async FETCH_CATEGORIES(lang?: string) {
        const { data } = await useAsyncData("categories", () => getCategoriesList(lang));
        this.categories = data.value;
      },
    },
  });

  const resultStore = innerStore();

  return resultStore;
};
