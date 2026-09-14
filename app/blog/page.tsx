import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Filter, Newspaper, Search } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { JsonLd } from "@/components/seo/json-ld";
import { blogDefaultSort, getBlogCategories, getBlogPosts, getSafeBlogErrorMessage, normalizeBlogPage, toApiPage } from "@/lib/blog";
import { absoluteUrl, buildMetadata, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function queryString(params: SearchParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const value = searchParams.toString();
  return value ? `?${value}` : "";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const page = normalizeBlogPage(params.page);
  return buildMetadata({
    title: page > 1 ? `InvoRights Blog Page ${page}` : "InvoRights Blog for Invoice Growth",
    description: "Read invoice, GST, payment tracking, quotation, expense, and reporting guides from InvoRights. Grow cleaner billing habits today.",
    path: `/blog${queryString(params)}`,
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const displayPage = normalizeBlogPage(params.page);
  const [categoriesResult, postsResult] = await Promise.allSettled([
    getBlogCategories(),
    getBlogPosts({
      page: toApiPage(displayPage),
      size: 10,
      sort: params.sort || blogDefaultSort,
      category: params.category,
      tag: params.tag,
      search: params.search,
    }),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value.filter((category) => category.status === "ACTIVE") : [];
  const postsPage = postsResult.status === "fulfilled" ? postsResult.value : null;
  const posts = postsPage?.content ?? [];
  const errorMessage = postsResult.status === "rejected" ? getSafeBlogErrorMessage(postsResult.reason) : null;

  const json = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteName} Blog`,
    url: absoluteUrl("/blog"),
    description: "Invoice, payment, quotation, expense, and reporting guides for small businesses.",
  };

  return (
    <>
      <JsonLd value={json} />
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
              <Newspaper className="h-4 w-4 text-primary" />
              InvoRights growth library
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Practical invoicing, tax, and payment guides for growing businesses.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Browse focused articles about invoices, GST, quotations, payment tracking, expenses, and financial reporting.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form action="/blog" className="mb-8 grid gap-3 rounded-lg border border-border bg-card p-4 shadow-sm lg:grid-cols-[1fr_220px_180px_auto] lg:items-end">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Search
            <span className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input name="search" defaultValue={params.search ?? ""} placeholder="Search blog articles" className="min-h-11 w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm" />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Category
            <select name="category" defaultValue={params.category ?? ""} className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Sort
            <select name="sort" defaultValue={params.sort ?? blogDefaultSort} className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm">
              <option value="publishedDate,desc">Newest first</option>
              <option value="publishedDate,asc">Oldest first</option>
              <option value="updatedDate,desc">Recently updated</option>
            </select>
          </label>
          {params.tag ? <input type="hidden" name="tag" value={params.tag} /> : null}
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90" type="submit">
            <Filter className="h-4 w-4" />
            Apply
          </button>
        </form>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Latest articles</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Newest first</h2>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/blog/category/${category.slug}`} className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">Blog content is unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        ) : posts.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} priority={displayPage === 1 && index < 2} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">No posts found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search, category, or tag filter.</p>
          </div>
        )}

        {postsPage ? (
          <div className="mt-10 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Page {postsPage.page + 1} of {Math.max(1, postsPage.totalPages)} · {postsPage.totalElements} articles
            </div>
            <div className="flex gap-2">
              <Link
                aria-disabled={postsPage.first}
                href={`/blog${queryString({ ...params, page: String(postsPage.page) })}`}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition ${postsPage.first ? "pointer-events-none opacity-45" : "hover:-translate-y-0.5 hover:bg-muted"}`}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Link>
              <Link
                aria-disabled={postsPage.last}
                href={`/blog${queryString({ ...params, page: String(postsPage.page + 2) })}`}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition ${postsPage.last ? "pointer-events-none opacity-45" : "hover:-translate-y-0.5 hover:bg-primary/90"}`}
              >
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
