import { SecurityCourseMapApp } from "@/components/security-map/SecurityCourseMapApp";
import { createMetadata } from "@/lib/seo/metadata";
import { isLocale } from "@/lib/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "zh";

  return createMetadata({
    title: "计算机安全课程知识图谱",
    description:
      "第18章：权限提升与 Shellcode 的交互式中文思维导图，支持拖拽、缩放、搜索、节点详情与章节目录。",
    locale: resolvedLocale,
    path: `/${resolvedLocale}/projects/security-course-map`,
  });
}

export default function SecurityCourseMapPage() {
  return <SecurityCourseMapApp />;
}
