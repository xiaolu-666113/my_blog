import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n/locales";
import { getSectionDir, type ContentSection } from "@/lib/content/paths";

export type MdxFile<T> = {
  slug: string;
  data: T;
  content: string;
};

export function getMdxSlugs(section: ContentSection, locale: Locale): string[] {
  const dir = getSectionDir(section, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllMdx<T>(section: ContentSection, locale: Locale): MdxFile<T>[] {
  const dir = getSectionDir(section, locale);
  if (!fs.existsSync(dir)) return [];

  return getMdxSlugs(section, locale).map((slug) => {
    const fullPath = path.join(dir, `${slug}.mdx`);
    const file = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(file);
    return {
      slug,
      data: data as T,
      content,
    };
  });
}

export function getMdxBySlug<T>(
  section: ContentSection,
  locale: Locale,
  slug: string,
): MdxFile<T> | null {
  const dir = getSectionDir(section, locale);
  const fullPath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  return {
    slug,
    data: data as T,
    content,
  };
}
