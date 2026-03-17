import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/locales";

const placeholderPatterns = [
  /example\.com/i,
  /your-handle/i,
  /^https:\/\/scholar\.google\.com\/?$/i,
  /^https:\/\/linkedin\.com\/in\/your-handle\/?$/i,
  /^https:\/\/github\.com\/your-handle\/?$/i,
];

export const siteConfig = {
  name: "Renwei Meng",
  title: "Renwei Meng | Research, Projects, Articles",
  description:
    "Renwei Meng's bilingual portfolio covering AI research, engineering projects, articles, and academic experience across LLM systems, computer vision, software engineering, and brain-computer interfaces.",
  url: "https://renweimeng.com",
  ogImage: "/covers/og-default.svg",
  keywords: [
    "Renwei Meng",
    "孟任巍",
    "AI Research",
    "LLM",
    "RAG",
    "Agent",
    "Computer Vision",
    "Brain-Computer Interface",
    "EEG",
    "Full-Stack Engineering",
    "Portfolio",
    "Research Blog",
  ],
  links: {
    emails: [
      "406987331@qq.com",
      "JingShangPiao@gmail.com",
      "R32314095@stu.ahu.edu.cn",
    ],
    github: "",
    linkedin: "",
    scholar: "https://scholar.google.com/citations?user=kbo7-WcAAAAJ&hl",
  },
};

export function getSiteName(locale: Locale) {
  return locale === "zh" ? "孟任巍" : "Renwei Meng";
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function isPublishableUrl(url?: string) {
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) return false;
  return !placeholderPatterns.some((pattern) => pattern.test(url));
}

export function getPublicProfileLinks() {
  return [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.scholar,
  ].filter(isPublishableUrl);
}

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
  const siteName = getSiteName(locale);
  const fullTitle = title ? `${title} | ${siteName}` : siteConfig.title;
  const url = getAbsoluteUrl(path);
  const imageUrl = image ?? siteConfig.ogImage;
  const absoluteImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : getAbsoluteUrl(imageUrl);

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description: description ?? siteConfig.description,
    applicationName: siteName,
    keywords: siteConfig.keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    category: "technology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: url,
      languages: {
        en: getAbsoluteUrl(`/en${path.replace(/^\/en/, "")}`),
        zh: getAbsoluteUrl(`/zh${path.replace(/^\/zh/, "")}`),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description: description ?? siteConfig.description,
      url,
      siteName,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type,
      images: [
        {
          url: absoluteImageUrl,
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
      images: [absoluteImageUrl],
    },
  };
}
