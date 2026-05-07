import type { Locale } from "@/lib/i18n/locales";
import { getAllMdx, getMdxBySlug } from "@/lib/content/mdx";

export type ArticleFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  href?: string;
  theme?: "default" | "purple";
};

export type Article = ArticleFrontmatter & { slug: string };
export type ArticleWithContent = ArticleFrontmatter & {
  slug: string;
  content: string;
};

function sortByDateDesc(a: { date: string }, b: { date: string }) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function getStaticArticles(locale: Locale): Article[] {
  if (locale === "zh") {
    return [
      {
        slug: "rasterlab",
        title: "RasterLab：光栅化算法可视化教程",
        date: "2026-05-07",
        summary:
          "一个面向计算机图形学复习的交互式算法实验室，支持 DDA、Bresenham、圆、多边形扫描线、区域填充、字符与 OpenGL 图元模式可视化。",
        tags: ["Tutorial", "Computer Graphics", "Rasterization"],
        href: "/zh/articles/rasterlab",
        theme: "purple",
      },
      {
        slug: "math-model-pre",
        title: "AI 教程：数学建模与智能方法实战指南",
        date: "2026-03-26",
        summary:
          "一套面向数学建模与 AI 实战的最新教程，涵盖 Agent、自动化工作流与竞赛导向方法设计。",
        tags: ["Tutorial", "AI", "Math Modeling"],
        href: "/math_model_pre/index.html",
        theme: "purple",
      },
    ];
  }

  return [
    {
      slug: "rasterlab",
      title: "RasterLab: Interactive Rasterization Tutorial",
      date: "2026-05-07",
      summary:
        "An interactive computer graphics lab for rasterization algorithms, covering DDA, Bresenham, circles, scanline polygons, region filling, fonts, and OpenGL primitive modes.",
      tags: ["Tutorial", "Computer Graphics", "Rasterization"],
      href: "/en/articles/rasterlab",
      theme: "purple",
    },
    {
      slug: "math-model-pre",
      title: "AI Tutorial: Mathematical Modeling and Intelligent Methods",
      date: "2026-03-26",
      summary:
        "A latest hands-on tutorial for AI-assisted mathematical modeling, covering agents, workflow automation, and competition-oriented methodology.",
      tags: ["Tutorial", "AI", "Math Modeling"],
      href: "/math_model_pre/index.html",
      theme: "purple",
    },
  ];
}

export function getAllArticles(locale: Locale): Article[] {
  return [
    ...getAllMdx<ArticleFrontmatter>("articles", locale).map((item) => ({
      ...item.data,
      slug: item.slug,
      theme: item.data.theme ?? "default",
    })),
    ...getStaticArticles(locale),
  ]
    .sort(sortByDateDesc);
}

export function getArticleBySlug(
  locale: Locale,
  slug: string,
): ArticleWithContent | null {
  const entry = getMdxBySlug<ArticleFrontmatter>("articles", locale, slug);
  if (!entry) return null;
  return {
    ...entry.data,
    slug: entry.slug,
    content: entry.content,
  };
}
