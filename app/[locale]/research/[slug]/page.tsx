import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { getAllResearch, getResearchBySlug } from "@/lib/content/research";
import { createMetadata, isPublishableUrl, siteConfig } from "@/lib/seo/metadata";
import { projectJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/formatDate";
import { getDictionary } from "@/lib/i18n/routing";
import { isLocale, locales, type Locale } from "@/lib/i18n/locales";

export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllResearch(locale).map((item) => ({ locale, slug: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "zh";
  const entry = getResearchBySlug(resolvedLocale, slug);
  const dict = getDictionary(resolvedLocale);

  if (!entry) {
    return createMetadata({
      title: dict.nav.research,
      description: dict.misc.notAvailable,
      locale: resolvedLocale,
      path: `/${resolvedLocale}/research/${slug}`,
    });
  }

  return createMetadata({
    title: entry.title,
    description: entry.summary,
    locale: resolvedLocale,
    path: `/${resolvedLocale}/research/${entry.slug}`,
    image: entry.cover,
    type: "article",
  });
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const resolvedLocale = locale as Locale;
  const dict = getDictionary(resolvedLocale);
  const entry = getResearchBySlug(resolvedLocale, slug);

  if (!entry) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{dict.misc.notAvailable}</h1>
        <p className="text-muted-foreground">{dict.misc.returnToList}</p>
        <Link
          href={`/${resolvedLocale}/research`}
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          {dict.actions.back}
        </Link>
      </div>
    );
  }

  const jsonLd = projectJsonLd({
    title: entry.title,
    description: entry.summary,
    url: new URL(
      `/${resolvedLocale}/research/${entry.slug}`,
      siteConfig.url,
    ).toString(),
    image: entry.cover,
  });
  const paperLink = isPublishableUrl(entry.links?.paper) ? entry.links?.paper : undefined;
  const codeLink = isPublishableUrl(entry.links?.code) ? entry.links?.code : undefined;
  const demoLink = isPublishableUrl(entry.links?.demo) ? entry.links?.demo : undefined;
  const posterLink = isPublishableUrl(entry.links?.poster) ? entry.links?.poster : undefined;

  return (
    <article className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="space-y-4">
        <Link
          href={`/${resolvedLocale}/research`}
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
          <Badge variant="secondary">{entry.status}</Badge>
          <Badge variant="outline">{entry.role}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        {paperLink || codeLink || demoLink || posterLink ? (
          <div className="flex flex-wrap gap-3 text-sm">
            {paperLink && (
              <a
                href={paperLink}
                className="font-medium underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {dict.links.paper}
              </a>
            )}
            {codeLink && (
              <a
                href={codeLink}
                className="font-medium underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {dict.links.code}
              </a>
            )}
            {demoLink && (
              <a
                href={demoLink}
                className="font-medium underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {dict.links.demo}
              </a>
            )}
            {posterLink && (
              <a
                href={posterLink}
                className="font-medium underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {dict.links.poster}
              </a>
            )}
          </div>
        ) : null}
      </header>
      <section className="max-w-3xl">
        <MdxRenderer source={entry.content} />
      </section>
    </article>
  );
}
