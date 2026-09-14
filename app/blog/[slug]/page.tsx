import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { BlogBody, BlogBreadcrumbs, BlogHeroImage, ProductLinks, RelatedPosts } from "@/components/blog/blog-content";
import { JsonLd } from "@/components/seo/json-ld";
import { blogDefaultSort, formatBlogDate, getBlogPostBySlug, getBlogPosts, getPostImage, isNotFoundBlogError } from "@/lib/blog";
import { absoluteUrl, buildMetadata, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getBlogPostBySlug((await params).slug);
    return buildMetadata({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      path: `/blog/${post.slug}`,
      image: getPostImage(post),
      type: "article",
    });
  } catch (error) {
    if (isNotFoundBlogError(error)) return {};
    return buildMetadata({
      title: "InvoRights Blog Article",
      description: "Read InvoRights invoice, payment, tax, and reporting guidance for growing businesses.",
      path: `/blog/${(await params).slug}`,
    });
  }
}

export default async function BlogPostPage({ params }: Props) {
  let post;
  try {
    post = await getBlogPostBySlug((await params).slug);
  } catch (error) {
    if (isNotFoundBlogError(error)) notFound();
    throw error;
  }

  const relatedResult = await getBlogPosts({ page: 0, size: 3, sort: blogDefaultSort, category: post.category.slug }).catch(() => null);
  const relatedPosts = relatedResult?.content.filter((candidate) => candidate.slug !== post.slug).slice(0, 3) ?? [];
  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const categoryUrl = absoluteUrl(`/blog/category/${post.category.slug}`);

  const articleJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
    image: [absoluteUrl(getPostImage(post))],
    mainEntityOfPage: postUrl,
  };

  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.category.name, item: categoryUrl },
      { "@type": "ListItem", position: 4, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <JsonLd value={articleJson} />
      <JsonLd value={breadcrumbJson} />
      <article>
        <header className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
            <div>
              <BlogBreadcrumbs post={post} />
              <Link href={`/blog/category/${post.category.slug}`} className="mt-6 inline-flex rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                {post.category.name}
              </Link>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-primary" />{post.authorName}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{formatBlogDate(post.publishedDate)}</span>
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{post.estimatedReadTime}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Updated {formatBlogDate(post.updatedDate)}</p>
            </div>
            <BlogHeroImage post={post} />
          </div>
        </header>

        <div className="mx-auto grid max-w-4xl gap-10 px-4 py-12 sm:px-6 lg:px-8">
          <BlogBody blocks={post.body ?? []} />
          <ProductLinks links={post.productLinks ?? []} />
          <div className="flex flex-wrap gap-2 border-t border-border pt-6">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${encodeURIComponent(tag.slug)}`} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-primary">
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      </article>

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
