import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Info, Quote } from "lucide-react";
import type { BlogBlock, BlogPostDetailResponse, BlogPostSummaryResponse, ProductLink } from "@/lib/blog";
import { getBlockImage, getPostImage, getPostImageAlt } from "@/lib/blog";
import { BlogCard } from "./blog-card";

function textValue(data: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function stringArray(data: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === "string" || typeof item === "number" ? String(item) : "")).filter(Boolean);
    }
  }
  return [];
}

function rowsValue(data: Record<string, unknown>) {
  const value = data.rows;
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => (Array.isArray(row) ? row.map((cell) => (typeof cell === "string" || typeof cell === "number" ? String(cell) : "")) : []))
    .filter((row) => row.length);
}

export function BlogBreadcrumbs({ post }: { post: BlogPostDetailResponse }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="transition hover:text-foreground">Home</Link>
      <span>/</span>
      <Link href="/blog" className="transition hover:text-foreground">Blog</Link>
      <span>/</span>
      <Link href={`/blog/category/${post.category.slug}`} className="transition hover:text-foreground">{post.category.name}</Link>
      <span>/</span>
      <span className="max-w-full truncate text-foreground">{post.title}</span>
    </nav>
  );
}

function BlogBlockView({ block }: { block: BlogBlock }) {
  const data = block.data ?? {};

  switch (block.type) {
    case "heading": {
      const level = Number(data.level ?? 2);
      const text = textValue(data, ["text", "content", "title"]);
      return level >= 3 ? <h3>{text}</h3> : <h2>{text}</h2>;
    }
    case "paragraph":
      return <p>{textValue(data, ["text", "content", "body"])}</p>;
    case "image": {
      const src = getBlockImage(data);
      return (
        <figure>
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={src} alt={textValue(data, ["alt", "caption"], "Blog section illustration")} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          {textValue(data, ["caption"]) ? <figcaption>{textValue(data, ["caption"])}</figcaption> : null}
        </figure>
      );
    }
    case "bulletList": {
      const items = stringArray(data, ["items", "list"]);
      return <ul>{items.map((item) => <li key={item}><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" /><span>{item}</span></li>)}</ul>;
    }
    case "numberedList": {
      const items = stringArray(data, ["items", "list"]);
      return <ol>{items.map((item) => <li key={item}>{item}</li>)}</ol>;
    }
    case "quote":
      return (
        <blockquote>
          <Quote className="h-5 w-5 text-primary" />
          <p>{textValue(data, ["text", "quote", "content"])}</p>
          {textValue(data, ["attribution", "author"]) ? <cite>{textValue(data, ["attribution", "author"])}</cite> : null}
        </blockquote>
      );
    case "code":
      return <pre><code>{textValue(data, ["code", "text", "content"])}</code></pre>;
    case "table": {
      const headers = stringArray(data, ["headers", "columns"]);
      const rows = rowsValue(data);
      return (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table>
            {headers.length ? <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead> : null}
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    }
    case "callout":
      return (
        <aside className="blog-callout">
          <Info className="h-5 w-5 text-primary" />
          <div>
            {textValue(data, ["title"]) ? <strong>{textValue(data, ["title"])}</strong> : null}
            <p>{textValue(data, ["text", "content", "body"])}</p>
          </div>
        </aside>
      );
    case "productCTA": {
      return (
        <Link href="/signup" className="blog-product-cta">
          <span>{textValue(data, ["label", "title", "text"], "Start with SmartInvoice")}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      );
    }
    default:
      return null;
  }
}

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="blog-prose">
      {[...blocks].sort((a, b) => a.order - b.order).map((block, index) => (
        <BlogBlockView key={`${block.type}-${block.order}-${index}`} block={block} />
      ))}
    </div>
  );
}

export function ProductLinks({ links }: { links: ProductLink[] }) {
  const ordered = [...links].sort((a, b) => a.order - b.order);
  if (!ordered.length) return null;

  return (
    <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5">
      <h2 className="text-lg font-semibold text-foreground">Continue with InvoRights</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ordered.map((link) => (
          <Link key={`${link.href}-${link.order}`} href="/signup" className="group flex min-h-12 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
            {link.label}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function RelatedPosts({ posts }: { posts: BlogPostSummaryResponse[] }) {
  if (!posts.length) return null;

  return (
    <section className="border-t border-border pt-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Related posts</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Keep building your billing workflow</h2>
        </div>
        <Link href="/blog" className="hidden text-sm font-medium text-primary transition hover:text-foreground sm:inline-flex">
          View all
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

export function BlogHeroImage({ post }: { post: BlogPostSummaryResponse }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted shadow-sm">
      <Image src={getPostImage(post)} alt={getPostImageAlt(post)} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-10" />
    </div>
  );
}
