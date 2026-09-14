import type { MetadataRoute } from "next";
import { getBlogCategories, getBlogSitemap } from "@/lib/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invorights.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    getBlogSitemap().catch(() => []),
    getBlogCategories().catch(() => []),
  ]);
  const marketingPages = ["", "/features", "/pricing", "/about", "/contact", "/blog"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-09-14"),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.85 : 0.75,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${siteUrl}/blog/category/${category.slug}`,
    lastModified: new Date("2026-09-14"),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const blogPosts = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate ?? post.publishedDate ?? "2026-09-14"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...marketingPages, ...categoryPages, ...blogPosts];
}
