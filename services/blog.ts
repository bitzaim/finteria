import { mediaApi } from "./axios";
import { Article, ArticleMeta, Category } from "./types/blog.type";

type ArticlesParams = {
  limit?: number;
  page?: number;
  categories?: number[];
  lang?: string;
};

const getCategoriesList = (lang: string = "en"): Promise<Category[]> => {
  return mediaApi()
    .get("/category", {
      params: {
        _translation_language: lang,
      },
    })
    .then((response) => response.data.data);
};

const getArticlesList = (
  params?: ArticlesParams
): Promise<{
  meta: ArticleMeta;
  data: Article[];
}> => {
  return mediaApi()
    .get("/article", {
      params: {
        page: params?.page,
        limit: params?.limit,
        has_categories: params?.categories,
        _translation_language: params?.lang || "en",
      },
    })
    .then((response) => {
      return {
        meta: response.data.meta,
        data: response.data.data,
      };
    });
};

const getArticle = (slug: string, lang: string = "en"): Promise<Article> => {
  return mediaApi()
    .get(`/article/${slug}`, {
      params: {
        _translation_language: lang,
      },
    })
    .then((response) => {
      return response.data.data;
    });
};

export { getCategoriesList, getArticlesList, getArticle };
