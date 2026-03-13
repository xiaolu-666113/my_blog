import { ResearchCard } from "@/components/cards/ResearchCard";
import { getAllResearch } from "@/lib/content/research";
import { createMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n/routing";
import { isLocale } from "@/lib/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "zh";
  const dict = getDictionary(resolvedLocale);
  return createMetadata({
    title: dict.nav.research,
    description: dict.sections.featuredResearch,
    locale: resolvedLocale,
    path: `/${resolvedLocale}/research`,
  });
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "zh";
  const dict = getDictionary(resolvedLocale);
  const items = getAllResearch(resolvedLocale);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {dict.nav.research}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          {dict.sections.featuredResearch}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ResearchCard key={item.slug} item={item} locale={resolvedLocale} />
        ))}
      </div>
    </div>
  );
}
