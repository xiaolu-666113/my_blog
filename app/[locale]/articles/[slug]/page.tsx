import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { getAllArticles, getArticleBySlug } from "@/lib/content/articles";
import { createMetadata, siteConfig } from "@/lib/seo/metadata";
import { articleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/formatDate";
import { getDictionary } from "@/lib/i18n/routing";
import { isLocale, locales, type Locale } from "@/lib/i18n/locales";

export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllArticles(locale).map((item) => ({ locale, slug: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "zh";
  const entry = getArticleBySlug(resolvedLocale, slug);
  const dict = getDictionary(resolvedLocale);

  if (!entry) {
    return createMetadata({
      title: dict.nav.articles,
      description: dict.misc.notAvailable,
      locale: resolvedLocale,
      path: `/${resolvedLocale}/articles/${slug}`,
    });
  }

  return createMetadata({
    title: entry.title,
    description: entry.summary,
    locale: resolvedLocale,
    path: `/${resolvedLocale}/articles/${entry.slug}`,
    image: entry.cover,
    type: "article",
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const resolvedLocale = locale as Locale;
  const dict = getDictionary(resolvedLocale);
  const entry = getArticleBySlug(resolvedLocale, slug);

  if (!entry) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{dict.misc.notAvailable}</h1>
        <p className="text-muted-foreground">{dict.misc.returnToList}</p>
        <Link
          href={`/${resolvedLocale}/articles`}
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          {dict.actions.back}
        </Link>
      </div>
    );
  }

  const jsonLd = articleJsonLd({
    title: entry.title,
    description: entry.summary,
    datePublished: entry.date,
    url: new URL(
      `/${resolvedLocale}/articles/${entry.slug}`,
      siteConfig.url,
    ).toString(),
    image: entry.cover,
  });

  return (
    <article className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="space-y-4">
        <Link
          href={`/${resolvedLocale}/articles`}
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          {dict.actions.back}
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">{entry.title}</h1>
        <p className="text-base text-muted-foreground">{entry.summary}</p>
        {entry.cover && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60">
            <Image
              src={entry.cover}
              alt={entry.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatDate(entry.date, resolvedLocale)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </header>
      <section className="max-w-3xl">
        <MdxRenderer source={entry.content} />
      </section>
    </article>
  );
}
