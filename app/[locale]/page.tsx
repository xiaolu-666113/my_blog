import Link from "next/link";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeFeatured } from "@/components/sections/HomeFeatured";
import { HomeLatestArticles } from "@/components/sections/HomeLatestArticles";
import { ResearchCard } from "@/components/cards/ResearchCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { getAllResearch } from "@/lib/content/research";
import { getAllProjects } from "@/lib/content/projects";
import { getAllArticles } from "@/lib/content/articles";
import { createMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n/routing";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "zh";
  const dict = getDictionary(resolvedLocale);
  return createMetadata({
    title: dict.nav.home,
    description: dict.home.heroSubtitle,
    locale: resolvedLocale,
    path: `/${resolvedLocale}`,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "zh";
  const dict = getDictionary(resolvedLocale);

  const research = getAllResearch(resolvedLocale).slice(0, 3);
  const projects = getAllProjects(resolvedLocale).slice(0, 3);
  const articles = getAllArticles(resolvedLocale).slice(0, 3);

  return (
    <div className="space-y-16">
      <HomeHero dict={dict} locale={resolvedLocale} />

      <HomeFeatured
        title={dict.sections.featuredResearch}
        viewAllHref={`/${resolvedLocale}/research`}
        viewAllLabel={dict.actions.viewAll}
      >
        {research.map((item) => (
          <ResearchCard key={item.slug} item={item} locale={resolvedLocale} />
        ))}
      </HomeFeatured>

      <HomeFeatured
        title={dict.sections.featuredProjects}
        viewAllHref={`/${resolvedLocale}/projects`}
        viewAllLabel={dict.actions.viewAll}
      >
        {projects.map((item) => (
          <ProjectCard key={item.slug} item={item} locale={resolvedLocale} />
        ))}
      </HomeFeatured>

      <HomeLatestArticles
        title={dict.sections.latestArticles}
        viewAllHref={`/${resolvedLocale}/articles`}
        viewAllLabel={dict.actions.viewAll}
      >
        {articles.map((item) => (
          <ArticleCard key={item.slug} item={item} locale={resolvedLocale} />
        ))}
      </HomeLatestArticles>

      <section className="rounded-3xl border border-border/70 bg-muted/30 px-6 py-10 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {dict.home.aboutKicker}
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.home.aboutTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {dict.home.aboutBody}
        </p>
        <Button asChild className="mt-6">
          <Link href={`/${resolvedLocale}/about`}>{dict.nav.about}</Link>
        </Button>
      </section>
    </div>
  );
}
