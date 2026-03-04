import type { Locale } from "@/lib/i18n/locales";
import { getAllMdx, getMdxBySlug } from "@/lib/content/mdx";

export type ArticleFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
};

export type Article = ArticleFrontmatter & { slug: string };
export type ArticleWithContent = ArticleFrontmatter & {
  slug: string;
  content: string;
};

function sortByDateDesc(a: { date: string }, b: { date: string }) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getAllArticles(locale: Locale): Article[] {
  return getAllMdx<ArticleFrontmatter>("articles", locale)
    .map((item) => ({
      ...item.data,
      slug: item.slug,
    }))
    .sort(sortByDateDesc);
}

export function getArticleBySlug(
  locale: Locale,
  slug: string,
): ArticleWithContent | null {
  const entry = getMdxBySlug<ArticleFrontmatter>("articles", locale, slug);
  if (!entry) return null;
  return {
    ...entry.data,
    slug: entry.slug,
    content: entry.content,
  };
}
