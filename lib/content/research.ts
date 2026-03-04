import type { Locale } from "@/lib/i18n/locales";
import { getAllMdx, getMdxBySlug } from "@/lib/content/mdx";

export type ResearchStatus = "Ongoing" | "Completed" | "Paper";

export type ResearchLinks = {
  paper?: string;
  code?: string;
  demo?: string;
  poster?: string;
};

export type ResearchFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  status: ResearchStatus;
  role: string;
  links?: ResearchLinks;
  cover?: string;
};

export type Research = ResearchFrontmatter & { slug: string };
export type ResearchWithContent = ResearchFrontmatter & {
  slug: string;
  content: string;
};

function sortByDateDesc(a: { date: string }, b: { date: string }) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getAllResearch(locale: Locale): Research[] {
  return getAllMdx<ResearchFrontmatter>("research", locale)
    .map((item) => ({
      ...item.data,
      slug: item.slug,
    }))
    .sort(sortByDateDesc);
}

export function getResearchBySlug(
  locale: Locale,
  slug: string,
): ResearchWithContent | null {
  const entry = getMdxBySlug<ResearchFrontmatter>("research", locale, slug);
  if (!entry) return null;
  return {
    ...entry.data,
    slug: entry.slug,
    content: entry.content,
  };
}
