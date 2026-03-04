import path from "node:path";
import type { Locale } from "@/lib/i18n/locales";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

export type ContentSection = "articles" | "research" | "projects";

export function getSectionDir(section: ContentSection, locale: Locale) {
  return path.join(CONTENT_ROOT, section, locale);
}

export function getPeoplePath(locale: Locale) {
  return path.join(CONTENT_ROOT, "people", `${locale}.json`);
}
