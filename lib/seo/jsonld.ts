import { siteConfig } from "@/lib/seo/metadata";

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
    image: image ? [image] : undefined,
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
    image: image ? [image] : undefined,
    creator: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}
