import { RasterLabApp } from "@/components/raster-lab/RasterLabApp";
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
    title: "RasterLab 光栅化算法可视化教程",
    description:
      "面向计算机图形学学习者的中文交互式光栅化算法实验室，覆盖点、直线、圆、多边形、区域填充、字符与 OpenGL 图元模式。",
    locale: resolvedLocale,
    path: `/${resolvedLocale}/articles/rasterlab`,
  });
}

export default function RasterLabPage() {
  return <RasterLabApp />;
}
