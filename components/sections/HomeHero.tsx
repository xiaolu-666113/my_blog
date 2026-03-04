import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/seo/metadata";
import type { Dictionary } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/locales";

export function HomeHero({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-muted/60 via-background to-background px-6 py-16 sm:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,120,120,0.12),_transparent_55%)]" />
      <div className="relative z-10 max-w-2xl space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {dict.home.heroKicker}
        </p>
        <p className="text-sm font-medium text-muted-foreground">
          {siteConfig.name}
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {dict.home.heroTitle}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {dict.home.heroSubtitle}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/${locale}/research`}>{dict.home.ctaResearch}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/articles`}>{dict.home.ctaArticles}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
