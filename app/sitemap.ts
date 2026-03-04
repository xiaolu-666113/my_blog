import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/locales";
import { getAllArticles } from "@/lib/content/articles";
import { getAllProjects } from "@/lib/content/projects";
import { getAllResearch } from "@/lib/content/research";
import { siteConfig } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "research", "projects", "articles", "about", "contact"];
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      entries.push({
        url: new URL(`/${locale}/${route}`.replace(/\/$/, ""), siteConfig.url)
          .toString(),
        lastModified: now,
      });
    });

    getAllResearch(locale).forEach((item) => {
      entries.push({
        url: new URL(`/${locale}/research/${item.slug}`, siteConfig.url).toString(),
        lastModified: now,
      });
    });

    getAllProjects(locale).forEach((item) => {
      entries.push({
        url: new URL(`/${locale}/projects/${item.slug}`, siteConfig.url).toString(),
        lastModified: now,
      });
    });

    getAllArticles(locale).forEach((item) => {
      entries.push({
        url: new URL(`/${locale}/articles/${item.slug}`, siteConfig.url).toString(),
        lastModified: now,
      });
    });
  });

  return entries;
}
