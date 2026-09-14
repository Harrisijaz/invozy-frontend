import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { JsonLd } from "@/components/seo/json-ld";
import { blogDefaultSort, getBlogCategories, getBlogPosts, getSafeBlogErrorMessage, normalizeBlogPage, toApiPage } from "@/lib/blog";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

function pageHref(category: string, page: number, sort?: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (sort) params.set("sort", sort);
  return `/blog/category/${category}?${params.toString()}`;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const categorySlug = (await params).category;
  const page = normalizeBlogPage((await searchParams).page);
  const categories = await getBlogCategories().catch(() => []);
  const category = categories.find((item) => item.slug === categorySlug);

  return buildMetadata({
    title: `${category?.name ?? "Blog Category"} Articles | InvoRights`,
    description: `Read InvoRights ${category?.name?.toLowerCase() ?? "business"} guides for better invoicing, payments, expenses, and reporting.`,
    path: page > 1 ? `/blog/category/${categorySlug}?page=${page}` : `/blog/category/${categorySlug}`,
  });
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const categorySlug = (await params).category;
  const query = await searchParams;
  const displayPage = normalizeBlogPage(query.page);
  const [categoriesResult, postsResult] = await Promise.allSettled([
    getBlogCategories(),
    getBlogPosts({
      category: categorySlug,
      page: toApiPage(displayPage),
      size: 10,
      sort: query.sort || blogDefaultSort,
    }),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const category = categories.find((item) => item.slug === categorySlug);
  const postsPage = postsResult.status === "fulfilled" ? postsResult.value : null;
  const posts = postsPage?.content ?? [];
  const errorMessage = postsResult.status === "rejected" ? getSafeBlogErrorMessage(postsResult.reason) : null;
  const categoryName = category?.name ?? categorySlug.replace(/-/g, " ");

  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Articles`,
    url: absoluteUrl(`/blog/category/${categorySlug}`),
    about: categoryName,
  };

  return (
    <>
      <JsonLd value={json} />
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase text-primary">Topic cluster</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight capitalize text-foreground sm:text-5xl">{categoryName} articles</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            {category?.description || `Focused InvoRights guidance for ${categoryName.toLowerCase()} workflows, written for search visibility and practical business use.`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {errorMessage ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">Category content is unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        ) : posts.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">No posts in this category</h2>
            <p className="mt-2 text-sm text-muted-foreground">Check back after new articles are published.</p>
          </div>
        )}

        {postsPage ? (
          <div className="mt-10 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Page {postsPage.page + 1} of {Math.max(1, postsPage.totalPages)}
            </div>
            <div className="flex gap-2">
              <Link aria-disabled={postsPage.first} href={pageHref(categorySlug, postsPage.page, query.sort)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition ${postsPage.first ? "pointer-events-none opacity-45" : "hover:-translate-y-0.5 hover:bg-muted"}`}>
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Link>
              <Link aria-disabled={postsPage.last} href={pageHref(categorySlug, postsPage.page + 2, query.sort)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition ${postsPage.last ? "pointer-events-none opacity-45" : "hover:-translate-y-0.5 hover:bg-primary/90"}`}>
                Next
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
