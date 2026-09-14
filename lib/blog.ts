import { cache } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9094";
const blogBasePath = "/api/blog";

export const blogPageSize = 10;
export const blogDefaultSort = "publishedDate,desc";
export const fallbackCoverImage = "/blog/invorights-business-guide.svg";

const blogCoverImages = [
  { keys: ["gst", "tax", "vat"], src: "/blog/gst-invoice-guide.svg" },
  { keys: ["quotation", "quote", "proposal"], src: "/blog/quotation-vs-invoice.svg" },
  { keys: ["payment", "paid", "cash-flow", "cash"], src: "/blog/payment-tracking.svg" },
  { keys: ["expense", "spending", "cost"], src: "/blog/expense-tracking.svg" },
  { keys: ["report", "analytics", "metric", "income", "finance", "financial"], src: "/blog/financial-reports.svg" },
  { keys: ["email", "send", "client"], src: "/blog/invoice-email.svg" },
  { keys: ["invoice", "billing"], src: "/blog/invoice-workflow.svg" },
] as const;

export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  publishedPostCount: number;
};

export type TagResponse = {
  id: string;
  name: string;
  slug: string;
};

export type BlogBlock = {
  type: string;
  order: number;
  data: Record<string, unknown>;
};

export type ProductLink = {
  label: string;
  href: string;
  order: number;
};

export type BlogPostSummaryResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorName: string;
  category: CategoryResponse;
  tags: TagResponse[];
  estimatedReadTime: string;
  publishedDate: string;
  updatedDate: string;
};

export type BlogPostDetailResponse = BlogPostSummaryResponse & {
  metaTitle: string;
  metaDescription: string;
  body: BlogBlock[];
  productLinks: ProductLink[];
};

export type BlogPageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type BlogListParams = {
  page?: number;
  size?: number;
  sort?: string;
  category?: string;
  tag?: string;
  search?: string;
};

export type BlogSitemapItem = {
  slug: string;
  updatedDate?: string;
  publishedDate?: string;
};

function blogUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${blogBasePath}${path}`, apiBaseUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`BLOG_API_${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getBlogPosts(params: BlogListParams = {}) {
  return fetchJson<BlogPageResponse<BlogPostSummaryResponse>>(
    blogUrl("/posts", {
      page: params.page ?? 0,
      size: params.size ?? blogPageSize,
      sort: params.sort ?? blogDefaultSort,
      category: params.category,
      tag: params.tag,
      search: params.search,
    }),
  );
}

export const getBlogCategories = cache(async () => fetchJson<CategoryResponse[]>(blogUrl("/categories")));

export const getBlogPostBySlug = cache(async (slug: string) => fetchJson<BlogPostDetailResponse>(blogUrl(`/posts/${encodeURIComponent(slug)}`)));

export async function getBlogSitemap() {
  return fetchJson<BlogSitemapItem[]>(blogUrl("/sitemap"));
}

export function isNotFoundBlogError(error: unknown) {
  return error instanceof Error && error.message === "BLOG_API_404";
}

export function getSafeBlogErrorMessage(error: unknown) {
  if (isNotFoundBlogError(error)) return "The requested blog post was not found.";
  if (error instanceof Error && error.message.startsWith("BLOG_API_")) return "Blog content is temporarily unavailable.";
  return "Unable to load blog content right now.";
}

export function normalizeBlogPage(page: string | undefined) {
  const parsed = Number(page ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export function toApiPage(displayPage: number) {
  return Math.max(0, displayPage - 1);
}

export function formatBlogDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(parsed);
}

export function getPostImage(post: Pick<BlogPostSummaryResponse, "title" | "slug" | "category" | "tags">) {
  const searchable = [
    post.slug,
    post.title,
    post.category.name,
    post.category.slug,
    ...post.tags.map((tag) => `${tag.name} ${tag.slug}`),
  ].join(" ").toLowerCase();

  return blogCoverImages.find((image) => image.keys.some((key) => searchable.includes(key)))?.src ?? fallbackCoverImage;
}

export function getPostImageAlt(post: Pick<BlogPostSummaryResponse, "coverImageAlt" | "title">) {
  return `${post.title} article illustration`;
}

export function getBlockImage(data: Record<string, unknown>) {
  const text = Object.values(data)
    .filter((value) => typeof value === "string" || typeof value === "number")
    .join(" ")
    .toLowerCase();

  return blogCoverImages.find((image) => image.keys.some((key) => text.includes(key)))?.src ?? fallbackCoverImage;
}
