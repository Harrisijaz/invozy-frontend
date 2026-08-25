import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invozy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/features", "/pricing", "/about", "/contact", "/login", "/signup"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-08-25"),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
