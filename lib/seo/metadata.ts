import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/locales";

export const siteConfig = {
  name: "Your Name",
  title: "Your Name — Research & Projects",
  description:
    "Personal research and product portfolio spanning AI systems, engineering projects, and writing.",
  url: "https://example.com",
  ogImage: "/covers/og-default.svg",
  links: {
    email: "hello@example.com",
    github: "https://github.com/your-handle",
    linkedin: "https://linkedin.com/in/your-handle",
    scholar: "https://scholar.google.com",
  },
};

export type MetadataOptions = {
  title: string;
  description?: string;
  locale: Locale;
  path: string;
  image?: string;
  type?: "website" | "article";
};

export function createMetadata({
  title,
  description,
  locale,
  path,
  image,
  type = "website",
}: MetadataOptions): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const url = new URL(path, siteConfig.url).toString();
  const imageUrl = image ?? siteConfig.ogImage;

  return {
    title: fullTitle,
    description: description ?? siteConfig.description,
    alternates: {
      canonical: url,
      languages: {
        en: new URL(`/en${path.replace(/^\/en/, "")}`, siteConfig.url).toString(),
        zh: new URL(`/zh${path.replace(/^\/zh/, "")}`, siteConfig.url).toString(),
      },
    },
    openGraph: {
      title: fullTitle,
      description: description ?? siteConfig.description,
      url,
      siteName: siteConfig.name,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description ?? siteConfig.description,
      images: [imageUrl],
    },
  };
}
