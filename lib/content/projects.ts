import type { Locale } from "@/lib/i18n/locales";
import { getAllMdx, getMdxBySlug } from "@/lib/content/mdx";

export type ProjectFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  stack: string[];
  repo?: string;
  demo?: string;
  cover?: string;
};

export type Project = ProjectFrontmatter & { slug: string };
export type ProjectWithContent = ProjectFrontmatter & {
  slug: string;
  content: string;
};

function sortByDateDesc(a: { date: string }, b: { date: string }) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getAllProjects(locale: Locale): Project[] {
  return getAllMdx<ProjectFrontmatter>("projects", locale)
    .map((item) => ({
      ...item.data,
      slug: item.slug,
    }))
    .sort(sortByDateDesc);
}

export function getProjectBySlug(
  locale: Locale,
  slug: string,
): ProjectWithContent | null {
  const entry = getMdxBySlug<ProjectFrontmatter>("projects", locale, slug);
  if (!entry) return null;
  return {
    ...entry.data,
    slug: entry.slug,
    content: entry.content,
  };
}
