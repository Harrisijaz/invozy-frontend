import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPostSummaryResponse } from "@/lib/blog";
import { formatBlogDate, getPostImage, getPostImageAlt } from "@/lib/blog";

export function BlogCard({ post, priority = false }: { post: BlogPostSummaryResponse; priority?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={getPostImage(post)}
            alt={getPostImageAlt(post)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-contain p-8 transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="grid gap-4 p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
          <Link href={`/blog/category/${post.category.slug}`} className="rounded-md bg-primary/10 px-2.5 py-1 text-primary transition hover:bg-primary hover:text-primary-foreground">
            {post.category.name}
          </Link>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.estimatedReadTime}
          </span>
          <span>{post.authorName}</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold leading-snug text-foreground">
            <Link href={`/blog/${post.slug}`} className="transition hover:text-primary">
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">{formatBlogDate(post.publishedDate)}</span>
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 font-medium text-primary">
            Read article <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
      {post.tags.length ? (
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          {post.tags.map((tag) => (
            <Link key={tag.id} href={`/blog?tag=${encodeURIComponent(tag.slug)}`} className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground transition hover:text-primary">
              #{tag.name}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
