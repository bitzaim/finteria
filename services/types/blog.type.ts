export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type SitemapArticle = {
  id: number;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: number;
  title: string;
  preview_text: string;
  slug: string;
  body: string;
  lang: string;
  main_image: string;
  categories: Category[];
  published_at: string;
  created_at: string;
};

type ArticleMetaLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type ArticleMeta = {
  current_page: number;
  from?: number;
  last_page: number;
  links?: ArticleMetaLink[];
  path?: string;
  per_page?: number;
  to?: number;
  total?: number;
};
