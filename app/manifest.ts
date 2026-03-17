import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/en",
    display: "standalone",
    background_color: "#f4f8fb",
    theme_color: "#1d4ed8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
