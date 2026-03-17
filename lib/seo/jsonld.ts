import { getAbsoluteUrl, getPublicProfileLinks, getSiteName, siteConfig } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/i18n/locales";

export function articleJsonLd({
  title,
  description,
  datePublished,
  url,
  image,
}: {
  title: string;
  description: string;
  datePublished: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    url,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    image: image ? [image.startsWith("http") ? image : getAbsoluteUrl(image)] : undefined,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: getSiteName(locale),
    alternateName: locale === "zh" ? "Renwei Meng" : "孟任巍",
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
  };
}

export function personJsonLd({
  locale,
  description,
  image,
}: {
  locale: Locale;
  description: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: getSiteName(locale),
    url: siteConfig.url,
    description,
    image: image ? getAbsoluteUrl(image) : undefined,
    email: siteConfig.links.emails[0]
      ? `mailto:${siteConfig.links.emails[0]}`
      : undefined,
    sameAs: getPublicProfileLinks(),
  };
}

export function profilePageJsonLd({
  locale,
  description,
  image,
}: {
  locale: Locale;
  description: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: personJsonLd({ locale, description, image }),
    url: getAbsoluteUrl(`/${locale}/about`),
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
  };
}

export function projectJsonLd({
  title,
  description,
  url,
  image,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url,
    image: image ? [image.startsWith("http") ? image : getAbsoluteUrl(image)] : undefined,
    creator: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}
