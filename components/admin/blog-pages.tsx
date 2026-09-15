"use client";

import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, FilePlus2, FolderTree, ImagePlus, Plus, RefreshCcw, Save, Send, Tags, X } from "lucide-react";
import { Column, DataTable } from "@/components/common/data-table";
import { Button, Card, ConfirmDialog, ErrorState, Input, PageHeader, StatusBadge } from "@/components/common/ui";
import { useToast } from "@/components/common/toast";
import {
  useAdminBlogCategories,
  useAdminBlogPost,
  useAdminBlogPosts,
  useAdminBlogTags,
  useArchiveBlogPost,
  useCreateBlogCategory,
  useCreateBlogPost,
  useCreateBlogTag,
  useDeleteBlogCategory,
  useRevalidateBlog,
  useUpdateBlogCategory,
  useUpdateBlogPost,
  useUpdateBlogStatus,
  useUploadBlogCover,
} from "@/hooks/admin/useBlog";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  BlogApiErrorBody,
  BlogBlock,
  BlogBlockType,
  BlogPostAdminResponse,
  BlogPostPayload,
  BlogStatus,
  CategoryPayload,
  CategoryResponse,
  CategoryStatus,
  ProductLink,
} from "@/types/admin/blog";

const blockTypes: BlogBlockType[] = ["paragraph", "heading", "image", "bulletList", "numberedList", "quote", "code", "table", "callout", "productCTA"];
const statusOptions: BlogStatus[] = ["DRAFT", "PUBLISHED", "UNPUBLISHED", "ARCHIVED"];
const defaultBlock: BlogBlock = { type: "paragraph", order: 0, data: { text: "" } };

type FieldErrors = Record<string, string>;

type BlogFormState = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  coverImageUrl: string;
  coverImageAlt: string;
  authorName: string;
  categoryId: string;
  tagIds: string[];
  status: BlogStatus;
  body: BlogBlock[];
  productLinks: ProductLink[];
  version?: number;
};

function emptyForm(): BlogFormState {
  return {
    title: "",
    slug: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    coverImageUrl: "",
    coverImageAlt: "",
    authorName: "",
    categoryId: "",
    tagIds: [],
    status: "DRAFT",
    body: [defaultBlock],
    productLinks: [],
  };
}

function fromPost(post: BlogPostAdminResponse): BlogFormState {
  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    excerpt: post.excerpt ?? "",
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    coverImageUrl: post.coverImageUrl ?? "",
    coverImageAlt: post.coverImageAlt ?? "",
    authorName: post.authorName ?? "",
    categoryId: post.category?.id ?? "",
    tagIds: post.tags.map((tag) => tag.id),
    status: post.status,
    body: post.body?.length ? post.body : [defaultBlock],
    productLinks: post.productLinks ?? [],
    version: post.version,
  };
}

function isJavascriptUrl(value: string) {
  return value.trim().toLowerCase().startsWith("javascript:");
}

function extractErrors(error: unknown) {
  const fallback = getApiErrorMessage(error);
  if (!axios.isAxiosError<BlogApiErrorBody>(error)) return { message: fallback, fields: {} as FieldErrors, code: undefined };
  const data = error.response?.data;
  if (data?.code === "BLOG_VERSION_CONFLICT") {
    return { message: "This blog post was updated by another admin. Refresh and try again.", fields: {}, code: data.code };
  }
  return {
    message: data?.message || fallback,
    fields: data?.fields ?? {},
    code: data?.code,
  };
}

function validateForm(value: BlogFormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!value.title.trim()) errors.title = "Title is required.";
  if (value.slug && isJavascriptUrl(value.slug)) errors.slug = "Slug cannot contain a script URL.";
  if (value.coverImageUrl && isJavascriptUrl(value.coverImageUrl)) errors.coverImageUrl = "Cover image URL is not allowed.";
  const hrefs = value.productLinks.map((link) => link.href.trim()).filter(Boolean);
  if (new Set(hrefs).size !== hrefs.length) errors.productLinks = "Product link href values must be unique.";
  value.productLinks.forEach((link, index) => {
    if (isJavascriptUrl(link.href)) errors[`productLinks.${index}.href`] = "Javascript URLs are not allowed.";
  });
  value.body.forEach((block, index) => {
    if (!blockTypes.includes(block.type)) errors[`body.${index}.type`] = "Unsupported block type.";
    if (block.type === "heading") {
      const level = Number(block.data.level ?? 2);
      if (![2, 3, 4].includes(level)) errors[`body.${index}.level`] = "Heading level must be 2, 3, or 4.";
    }
    const href = typeof block.data.href === "string" ? block.data.href : "";
    const url = typeof block.data.url === "string" ? block.data.url : "";
    if ((href && isJavascriptUrl(href)) || (url && isJavascriptUrl(url))) errors[`body.${index}.url`] = "Javascript URLs are not allowed.";
  });
  return errors;
}

function toPayload(value: BlogFormState): BlogPostPayload {
  return {
    title: value.title.trim(),
    slug: value.slug.trim() || undefined,
    excerpt: value.excerpt.trim() || undefined,
    metaTitle: value.metaTitle.trim() || undefined,
    metaDescription: value.metaDescription.trim() || undefined,
    coverImageUrl: value.coverImageUrl.trim() || undefined,
    coverImageAlt: value.coverImageAlt.trim() || undefined,
    authorName: value.authorName.trim() || undefined,
    categoryId: value.categoryId || undefined,
    tagIds: value.tagIds,
    body: value.body.map((block, index) => ({ ...block, order: index })),
    productLinks: value.productLinks.map((link, index) => ({ ...link, order: index })),
    status: value.status,
    version: value.version,
  };
}

function formatDate(value?: string) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function nextStatuses(status: BlogStatus): BlogStatus[] {
  if (status === "DRAFT") return ["PUBLISHED", "ARCHIVED"];
  if (status === "PUBLISHED") return ["UNPUBLISHED", "ARCHIVED"];
  if (status === "UNPUBLISHED") return ["PUBLISHED", "ARCHIVED"];
  return ["DRAFT"];
}

export function AdminBlogPostsPage() {
  const toast = useToast();
  const [filters, setFilters] = useState({ status: "" as BlogStatus | "", category: "", tag: "", search: "", createdBy: "", publishedFrom: "", publishedTo: "", page: 0, size: 10, sort: "createdAt,desc" });
  const posts = useAdminBlogPosts(filters);
  const categories = useAdminBlogCategories();
  const tags = useAdminBlogTags();
  const statusMutation = useUpdateBlogStatus();
  const archiveMutation = useArchiveBlogPost();
  const revalidate = useRevalidateBlog();
  const [confirmArchive, setConfirmArchive] = useState<BlogPostAdminResponse | null>(null);

  const updateFilter = (key: keyof typeof filters, value: string | number) => setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? Number(value) : 0 }));

  const columns: Column<BlogPostAdminResponse>[] = [
    { key: "title", header: "Post", render: (post) => <div className="min-w-60"><Link href={`/admin/blog/posts/${post.id}/edit`} className="font-semibold text-primary hover:underline">{post.title}</Link><p className="mt-1 text-xs text-muted-foreground">/{post.slug}</p></div> },
    { key: "category", header: "Category", render: (post) => post.category?.name ?? "Unassigned" },
    { key: "tags", header: "Tags", render: (post) => <div className="flex max-w-60 flex-wrap gap-1">{post.tags.map((tag) => <span key={tag.id} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{tag.name}</span>)}</div> },
    { key: "status", header: "Status", render: (post) => <StatusBadge value={post.status} /> },
    { key: "authorName", header: "Author", render: (post) => post.authorName || "Not set" },
    { key: "estimatedReadTime", header: "Read" },
    { key: "publishedDate", header: "Published", render: (post) => formatDate(post.publishedDate) },
    { key: "updatedAt", header: "Updated", render: (post) => formatDate(post.updatedAt) },
    { key: "createdBy", header: "Created By" },
    { key: "version", header: "Version", render: (post) => `v${post.version}` },
    {
      key: "actions",
      header: "Actions",
      render: (post) => (
        <div className="flex min-w-72 flex-wrap gap-2">
          <Link href={`/admin/blog/posts/${post.id}/edit`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-muted">Edit</Link>
          {nextStatuses(post.status).map((status) => (
            <Button key={status} variant={status === "ARCHIVED" ? "ghost" : "secondary"} onClick={() => status === "ARCHIVED" ? setConfirmArchive(post) : statusMutation.mutate({ id: post.id, status }, { onSuccess: () => toast(`Post moved to ${status}`, "success"), onError: (error) => toast(extractErrors(error).message, "error") })}>
              {status === "PUBLISHED" ? "Publish" : status === "UNPUBLISHED" ? "Unpublish" : status === "DRAFT" ? "Restore" : "Archive"}
            </Button>
          ))}
          {post.status === "PUBLISHED" ? <a className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted" href={`https://invorights.com/blog/${post.slug}`} target="_blank" rel="noreferrer"><Eye className="h-4 w-4" />Preview</a> : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Manage published posts, drafts, unpublished posts, and archived blog content."
        actions={<><Button variant="secondary" onClick={() => revalidate.mutate(["/blog", "/sitemap.xml"], { onSuccess: () => toast("Blog revalidation requested", "success"), onError: (error) => toast(getApiErrorMessage(error), "error") })} isLoading={revalidate.isPending}><RefreshCcw className="h-4 w-4" /> Revalidate</Button><Link href="/admin/blog/posts/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><FilePlus2 className="h-4 w-4" /> New Post</Link></>}
      />
      <Card className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
        <Input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Search posts" />
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}><option value="">All statuses</option>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}><option value="">All categories</option>{categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={filters.tag} onChange={(event) => updateFilter("tag", event.target.value)}><option value="">All tags</option>{tags.data?.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select>
        <Input value={filters.createdBy} onChange={(event) => updateFilter("createdBy", event.target.value)} placeholder="Created by" />
        <Input type="date" value={filters.publishedFrom} onChange={(event) => updateFilter("publishedFrom", event.target.value)} aria-label="Published from" />
        <Input type="date" value={filters.publishedTo} onChange={(event) => updateFilter("publishedTo", event.target.value)} aria-label="Published to" />
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}><option value="createdAt,desc">Newest created</option><option value="updatedAt,desc">Recently updated</option><option value="publishedDate,desc">Newest published</option><option value="title,asc">Title A-Z</option></select>
      </Card>
      <DataTable data={posts.data?.content ?? []} columns={columns} searchKeys={["title", "slug", "createdBy"]} loading={posts.isLoading} error={posts.isError} showSearch={false} clientPagination={false} emptyTitle="No blog posts found" />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Page {(posts.data?.page ?? filters.page) + 1}{posts.data?.totalPages ? ` of ${posts.data.totalPages}` : ""} · {posts.data?.totalElements ?? 0} posts</span>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={Boolean(posts.data?.first) || filters.page <= 0} onClick={() => updateFilter("page", Math.max(0, filters.page - 1))}>Previous</Button>
          <Button variant="secondary" disabled={Boolean(posts.data?.last)} onClick={() => updateFilter("page", filters.page + 1)}>Next</Button>
        </div>
      </div>
      <ConfirmDialog open={Boolean(confirmArchive)} title="Archive blog post?" description="This uses the archive endpoint and does not permanently delete the post." confirmLabel="Archive" onCancel={() => setConfirmArchive(null)} loading={archiveMutation.isPending} onConfirm={() => confirmArchive ? archiveMutation.mutate(confirmArchive.id, { onSuccess: () => { toast("Post archived", "success"); setConfirmArchive(null); }, onError: (error) => toast(extractErrors(error).message, "error") }) : undefined} />
    </div>
  );
}

export function AdminBlogNewPage() {
  return <BlogFormPage mode="create" />;
}

export function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const post = useAdminBlogPost(id);
  if (post.isLoading) return <PageHeader title="Edit Blog Post" description="Loading post details." />;
  if (post.isError || !post.data) return <ErrorState description={getApiErrorMessage(post.error)} onRetry={() => void post.refetch()} />;
  return <BlogFormPage mode="edit" post={post.data} />;
}

function BlogFormPage({ mode, post }: { mode: "create" | "edit"; post?: BlogPostAdminResponse }) {
  const router = useRouter();
  const toast = useToast();
  const categories = useAdminBlogCategories();
  const tags = useAdminBlogTags();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const statusMutation = useUpdateBlogStatus();
  const [value, setValue] = useState<BlogFormState>(() => post ? fromPost(post) : emptyForm());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");

  const setField = <K extends keyof BlogFormState>(key: K, next: BlogFormState[K]) => setValue((current) => ({ ...current, [key]: next }));
  const save = () => {
    const nextErrors = validateForm(value);
    setErrors(nextErrors);
    setGlobalError("");
    if (Object.keys(nextErrors).length) return;
    const payload = toPayload(value);
    const mutationOptions = {
      onSuccess: (saved: BlogPostAdminResponse) => {
        toast(mode === "create" ? "Blog post created" : "Blog post saved", "success");
        router.replace(`/admin/blog/posts/${saved.id}/edit`);
      },
      onError: (error: unknown) => {
        const parsed = extractErrors(error);
        setErrors(parsed.fields);
        setGlobalError(parsed.message);
        toast(parsed.message, "error");
      },
    };
    if (mode === "create") createPost.mutate(payload, mutationOptions);
    if (mode === "edit" && post) updatePost.mutate({ id: post.id, payload }, mutationOptions);
  };

  const publish = () => {
    if (!post) return;
    statusMutation.mutate({ id: post.id, status: "PUBLISHED" }, {
      onSuccess: (saved) => {
        setValue(fromPost(saved));
        toast("Post published", "success");
      },
      onError: (error) => {
        const parsed = extractErrors(error);
        setErrors(parsed.fields);
        setGlobalError(parsed.code === "BLOG_PUBLISH_VALIDATION_FAILED" ? "Publishing failed. Review the highlighted fields and try again." : parsed.message);
        toast(parsed.message, "error");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "create" ? "Create Blog Post" : "Edit Blog Post"}
        description="Create SEO-ready blog content with structured body blocks and controlled publication workflow."
        actions={<><Link href="/admin/blog/posts" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"><ArrowLeft className="h-4 w-4" />Back</Link>{post?.status === "PUBLISHED" ? <a className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted" href={`https://invorights.com/blog/${post.slug}`} target="_blank" rel="noreferrer"><Eye className="h-4 w-4" />Public Preview</a> : null}<Button onClick={save} isLoading={createPost.isPending || updatePost.isPending}><Save className="h-4 w-4" />Save</Button>{mode === "edit" && post?.status !== "PUBLISHED" ? <Button variant="secondary" onClick={publish} isLoading={statusMutation.isPending}><Send className="h-4 w-4" />Publish</Button> : null}</>}
      />
      {globalError ? <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error">{globalError}</div> : null}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="grid gap-4">
            <h2 className="text-lg font-semibold">Post Details</h2>
            <div className="grid gap-4 md:grid-cols-2"><AdminField label="Title" error={errors.title}><Input value={value.title} onChange={(event) => setField("title", event.target.value)} /></AdminField><AdminField label="Slug" error={errors.slug}><Input value={value.slug} onChange={(event) => setField("slug", event.target.value)} placeholder="Leave empty to let backend generate" /></AdminField></div>
            <AdminField label="Excerpt" error={errors.excerpt}><Textarea value={value.excerpt} onChange={(event) => setField("excerpt", event.target.value)} rows={3} /></AdminField>
            <div className="grid gap-4 md:grid-cols-2"><AdminField label="Meta Title" error={errors.metaTitle}><Input value={value.metaTitle} onChange={(event) => setField("metaTitle", event.target.value)} /></AdminField><AdminField label="Author Name" error={errors.authorName}><Input value={value.authorName} onChange={(event) => setField("authorName", event.target.value)} /></AdminField></div>
            <AdminField label="Meta Description" error={errors.metaDescription}><Textarea value={value.metaDescription} onChange={(event) => setField("metaDescription", event.target.value)} rows={3} /></AdminField>
          </Card>
          <CoverImageCard value={value} setField={setField} errors={errors} setErrors={setErrors} />
          <BodyEditor blocks={value.body} onChange={(body) => setField("body", body)} errors={errors} />
          <ProductLinksEditor links={value.productLinks} onChange={(productLinks) => setField("productLinks", productLinks)} errors={errors} />
        </div>
        <aside className="space-y-6">
          <Card className="grid gap-4">
            <h2 className="text-lg font-semibold">Publishing</h2>
            <AdminField label="Status" error={errors.status}><select className="min-h-10 rounded-lg border border-border bg-card px-3 text-sm" value={value.status} onChange={(event) => setField("status", event.target.value as BlogStatus)}>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></AdminField>
            <AdminField label="Category" error={errors.categoryId}><select className="min-h-10 rounded-lg border border-border bg-card px-3 text-sm" value={value.categoryId} onChange={(event) => setField("categoryId", event.target.value)}><option value="">Select category</option>{categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></AdminField>
            <AdminField label="Tags" error={errors.tagIds}><div className="grid max-h-56 gap-2 overflow-y-auto rounded-lg border border-border p-3">{tags.data?.map((tag) => <label key={tag.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.tagIds.includes(tag.id)} onChange={(event) => setField("tagIds", event.target.checked ? [...value.tagIds, tag.id] : value.tagIds.filter((id) => id !== tag.id))} />{tag.name}</label>)}</div></AdminField>
            {post ? <InfoGrid rows={[["Version", `v${post.version}`], ["Created", formatDate(post.createdAt)], ["Updated", formatDate(post.updatedAt)], ["Created By", post.createdBy], ["Updated By", post.updatedBy]]} /> : null}
          </Card>
          {mode === "edit" && post ? <DraftPreview post={{ ...post, ...toPayload(value), category: categories.data?.find((category) => category.id === value.categoryId), tags: tags.data?.filter((tag) => value.tagIds.includes(tag.id)) ?? [], id: post.id, createdAt: post.createdAt, updatedAt: post.updatedAt, createdBy: post.createdBy, updatedBy: post.updatedBy, estimatedReadTime: post.estimatedReadTime, version: post.version }} /> : null}
        </aside>
      </div>
    </div>
  );
}

function CoverImageCard({ value, setField, errors, setErrors }: { value: BlogFormState; setField: <K extends keyof BlogFormState>(key: K, next: BlogFormState[K]) => void; errors: FieldErrors; setErrors: (errors: FieldErrors) => void }) {
  const upload = useUploadBlogCover();
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const uploadFile = () => {
    if (!file) return;
    upload.mutate({ file, altText: value.coverImageAlt || value.title }, {
      onSuccess: (response) => {
        setField("coverImageUrl", response.url);
        setField("coverImageAlt", response.altText);
        toast("Cover image uploaded", "success");
      },
      onError: (error) => {
        const parsed = extractErrors(error);
        setErrors(parsed.fields);
        toast(parsed.code === "BLOG_UPLOAD_TOO_LARGE" ? "Image is too large." : parsed.code === "BLOG_INVALID_MEDIA_TYPE" ? "Use JPEG, PNG, WEBP, or AVIF." : parsed.message, "error");
      },
    });
  };
  return (
    <Card className="grid gap-4">
      <h2 className="text-lg font-semibold">Cover Image</h2>
      <div className="grid gap-4 md:grid-cols-2"><AdminField label="Cover Image URL" error={errors.coverImageUrl}><Input value={value.coverImageUrl} onChange={(event) => setField("coverImageUrl", event.target.value)} /></AdminField><AdminField label="Cover Image Alt" error={errors.coverImageAlt}><Input value={value.coverImageAlt} onChange={(event) => setField("coverImageAlt", event.target.value)} /></AdminField></div>
      <div className="grid gap-3 rounded-lg border border-border bg-muted/35 p-4 md:grid-cols-[1fr_auto]">
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="text-sm" />
        <Button variant="secondary" disabled={!file} isLoading={upload.isPending} onClick={uploadFile}><ImagePlus className="h-4 w-4" />Upload</Button>
      </div>
    </Card>
  );
}

function BodyEditor({ blocks, onChange, errors }: { blocks: BlogBlock[]; onChange: (blocks: BlogBlock[]) => void; errors: FieldErrors }) {
  const updateBlock = (index: number, block: BlogBlock) => onChange(blocks.map((item, itemIndex) => itemIndex === index ? { ...block, order: index } : item));
  const removeBlock = (index: number) => onChange(blocks.filter((_, itemIndex) => itemIndex !== index).map((block, order) => ({ ...block, order })));
  return (
    <Card className="grid gap-4">
      <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Body Blocks</h2><Button variant="secondary" onClick={() => onChange([...blocks, { ...defaultBlock, order: blocks.length }])}><Plus className="h-4 w-4" />Add Block</Button></div>
      <div className="grid gap-4">
        {blocks.map((block, index) => (
          <div key={`${block.order}-${index}`} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <select className="min-h-10 rounded-lg border border-border bg-card px-3 text-sm" value={block.type} onChange={(event) => updateBlock(index, blockForType(event.target.value as BlogBlockType, index))}>{blockTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>
              <Button variant="ghost" onClick={() => removeBlock(index)}><X className="h-4 w-4" />Remove</Button>
            </div>
            <BlockFields block={block} index={index} onChange={(next) => updateBlock(index, next)} />
            {errors[`body.${index}.type`] || errors[`body.${index}.level`] || errors[`body.${index}.url`] ? <p className="mt-2 text-sm text-error">{errors[`body.${index}.type`] || errors[`body.${index}.level`] || errors[`body.${index}.url`]}</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

function blockForType(type: BlogBlockType, order: number): BlogBlock {
  if (type === "heading") return { type, order, data: { level: 2, text: "" } };
  if (type === "image") return { type, order, data: { url: "", alt: "", caption: "" } };
  if (type === "bulletList" || type === "numberedList") return { type, order, data: { items: [""] } };
  if (type === "quote") return { type, order, data: { text: "", attribution: "" } };
  if (type === "code") return { type, order, data: { code: "", language: "text" } };
  if (type === "table") return { type, order, data: { headers: ["Column 1", "Column 2"], rows: [["", ""]] } };
  if (type === "callout") return { type, order, data: { title: "", text: "" } };
  if (type === "productCTA") return { type, order, data: { label: "", href: "/signup" } };
  return { type, order, data: { text: "" } };
}

function BlockFields({ block, index, onChange }: { block: BlogBlock; index: number; onChange: (block: BlogBlock) => void }) {
  const data = block.data;
  const setData = (next: Record<string, unknown>) => onChange({ ...block, data: next });
  const textareaClass = "min-h-28 rounded-lg border border-border bg-card px-3 py-2 text-sm";
  if (block.type === "heading") return <div className="grid gap-3 md:grid-cols-[120px_1fr]"><select className="min-h-10 rounded-lg border border-border bg-card px-3 text-sm" value={Number(data.level ?? 2)} onChange={(event) => setData({ ...data, level: Number(event.target.value) })}><option value={2}>H2</option><option value={3}>H3</option><option value={4}>H4</option></select><Input value={String(data.text ?? "")} onChange={(event) => setData({ ...data, text: event.target.value })} placeholder="Heading text" /></div>;
  if (block.type === "image") return <div className="grid gap-3"><Input value={String(data.url ?? "")} onChange={(event) => setData({ ...data, url: event.target.value })} placeholder="Image URL" /><Input value={String(data.alt ?? "")} onChange={(event) => setData({ ...data, alt: event.target.value })} placeholder="Alt text" /><Input value={String(data.caption ?? "")} onChange={(event) => setData({ ...data, caption: event.target.value })} placeholder="Caption" /></div>;
  if (block.type === "bulletList" || block.type === "numberedList") return <Textarea className={textareaClass} value={(Array.isArray(data.items) ? data.items : []).join("\n")} onChange={(event) => setData({ ...data, items: event.target.value.split("\n").filter(Boolean) })} placeholder="One item per line" />;
  if (block.type === "quote") return <div className="grid gap-3"><Textarea className={textareaClass} value={String(data.text ?? "")} onChange={(event) => setData({ ...data, text: event.target.value })} placeholder="Quote text" /><Input value={String(data.attribution ?? "")} onChange={(event) => setData({ ...data, attribution: event.target.value })} placeholder="Attribution" /></div>;
  if (block.type === "code") return <div className="grid gap-3"><Input value={String(data.language ?? "")} onChange={(event) => setData({ ...data, language: event.target.value })} placeholder="Language" /><Textarea className={textareaClass} value={String(data.code ?? "")} onChange={(event) => setData({ ...data, code: event.target.value })} placeholder="Code" /></div>;
  if (block.type === "table") return <Textarea className={textareaClass} value={JSON.stringify(data, null, 2)} onChange={(event) => { try { setData(JSON.parse(event.target.value) as Record<string, unknown>); } catch { /* keep current valid table data */ } }} aria-label={`Table JSON ${index}`} />;
  if (block.type === "callout") return <div className="grid gap-3"><Input value={String(data.title ?? "")} onChange={(event) => setData({ ...data, title: event.target.value })} placeholder="Callout title" /><Textarea className={textareaClass} value={String(data.text ?? "")} onChange={(event) => setData({ ...data, text: event.target.value })} placeholder="Callout text" /></div>;
  if (block.type === "productCTA") return <div className="grid gap-3 md:grid-cols-2"><Input value={String(data.label ?? "")} onChange={(event) => setData({ ...data, label: event.target.value })} placeholder="CTA label" /><Input value={String(data.href ?? "")} onChange={(event) => setData({ ...data, href: event.target.value })} placeholder="/signup" /></div>;
  return <Textarea className={textareaClass} value={String(data.text ?? "")} onChange={(event) => setData({ ...data, text: event.target.value })} placeholder="Paragraph text" />;
}

function ProductLinksEditor({ links, onChange, errors }: { links: ProductLink[]; onChange: (links: ProductLink[]) => void; errors: FieldErrors }) {
  return (
    <Card className="grid gap-4">
      <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Product Links</h2><Button variant="secondary" onClick={() => onChange([...links, { label: "", href: "/signup", order: links.length }])}><Plus className="h-4 w-4" />Add Link</Button></div>
      {errors.productLinks ? <p className="text-sm text-error">{errors.productLinks}</p> : null}
      <div className="grid gap-3">{links.map((link, index) => <div key={index} className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_1fr_auto]"><Input value={link.label} onChange={(event) => onChange(links.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} placeholder="Create Invoice Free" /><Input value={link.href} onChange={(event) => onChange(links.map((item, itemIndex) => itemIndex === index ? { ...item, href: event.target.value } : item))} placeholder="/invoice-generator" /><Button variant="ghost" onClick={() => onChange(links.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>{errors[`productLinks.${index}.href`] ? <p className="md:col-span-3 text-sm text-error">{errors[`productLinks.${index}.href`]}</p> : null}</div>)}</div>
    </Card>
  );
}

export function AdminBlogTaxonomyPage() {
  const toast = useToast();
  const categories = useAdminBlogCategories();
  const tags = useAdminBlogTags();
  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory();
  const deleteCategory = useDeleteBlogCategory();
  const createTag = useCreateBlogTag();
  const [categoryForm, setCategoryForm] = useState<CategoryPayload>({ name: "", slug: "", description: "", status: "ACTIVE" });
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [tagName, setTagName] = useState("");
  const activeForm = editingCategory ? { name: editingCategory.name, slug: editingCategory.slug, description: editingCategory.description ?? "", status: editingCategory.status } : categoryForm;
  const setActiveForm = (next: CategoryPayload) => editingCategory ? setEditingCategory({ ...editingCategory, ...next }) : setCategoryForm(next);
  const saveCategory = () => {
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, payload: activeForm }, { onSuccess: () => { toast("Category updated", "success"); setEditingCategory(null); }, onError: (error) => toast(getApiErrorMessage(error), "error") });
      return;
    }
    createCategory.mutate(categoryForm, { onSuccess: () => { toast("Category created", "success"); setCategoryForm({ name: "", slug: "", description: "", status: "ACTIVE" }); }, onError: (error) => toast(getApiErrorMessage(error), "error") });
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Blog Categories & Tags" description="Manage topic clusters and tags used by blog posts." actions={<Link href="/admin/blog/posts" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"><ArrowLeft className="h-4 w-4" />Posts</Link>} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="flex items-center gap-2"><FolderTree className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Categories</h2></div>
          <div className="grid gap-3 md:grid-cols-2"><Input value={activeForm.name} onChange={(event) => setActiveForm({ ...activeForm, name: event.target.value })} placeholder="Category name" /><Input value={activeForm.slug} onChange={(event) => setActiveForm({ ...activeForm, slug: event.target.value })} placeholder="category-slug" /></div>
          <Textarea value={activeForm.description ?? ""} onChange={(event) => setActiveForm({ ...activeForm, description: event.target.value })} rows={3} placeholder="Description" />
          <div className="flex flex-wrap gap-2"><select className="min-h-10 rounded-lg border border-border bg-card px-3 text-sm" value={activeForm.status} onChange={(event) => setActiveForm({ ...activeForm, status: event.target.value as CategoryStatus })}><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select><Button onClick={saveCategory} isLoading={createCategory.isPending || updateCategory.isPending}>{editingCategory ? "Update Category" : "Create Category"}</Button>{editingCategory ? <Button variant="secondary" onClick={() => setEditingCategory(null)}>Cancel</Button> : null}</div>
          <div className="grid gap-3">{categories.isLoading ? <p className="text-sm text-muted-foreground">Loading categories...</p> : categories.data?.map((category) => <div key={category.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{category.name}</p><p className="text-sm text-muted-foreground">/{category.slug} · {category.publishedPostCount} published</p></div><div className="flex gap-2"><StatusBadge value={category.status} /><Button variant="secondary" onClick={() => setEditingCategory(category)}>Edit</Button><Button variant="ghost" onClick={() => deleteCategory.mutate(category.id, { onSuccess: () => toast("Category deleted", "success"), onError: (error) => toast(getApiErrorMessage(error), "error") })}>Delete</Button></div></div>)}</div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center gap-2"><Tags className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Tags</h2></div>
          <div className="flex gap-2"><Input value={tagName} onChange={(event) => setTagName(event.target.value)} placeholder="Invoice" /><Button disabled={!tagName.trim()} isLoading={createTag.isPending} onClick={() => createTag.mutate(tagName, { onSuccess: () => { toast("Tag created", "success"); setTagName(""); }, onError: (error) => toast(getApiErrorMessage(error), "error") })}>Create</Button></div>
          <div className="flex flex-wrap gap-2">{tags.isLoading ? <p className="text-sm text-muted-foreground">Loading tags...</p> : tags.data?.map((tag) => <span key={tag.id} className="rounded-md bg-muted px-2.5 py-1 text-sm text-muted-foreground">#{tag.name}</span>)}</div>
        </Card>
      </div>
    </div>
  );
}

function DraftPreview({ post }: { post: BlogPostAdminResponse }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Admin Preview</h2>
      <p className="mt-2 text-sm text-muted-foreground">Draft preview is rendered from the admin response and is not exposed through public APIs.</p>
      <div className="mt-4 rounded-lg border border-border p-4">
        <StatusBadge value={post.status} />
        <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{post.excerpt || "No excerpt yet."}</p>
        <div className="mt-3 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag.id} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">#{tag.name}</span>)}</div>
      </div>
    </Card>
  );
}

function AdminField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium text-foreground"><span>{label}</span>{children}{error ? <span className="text-sm font-normal text-error">{error}</span> : null}</label>;
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-24 w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20", className)} />;
}

function InfoGrid({ rows }: { rows: [string, React.ReactNode][] }) {
  return <dl className="grid gap-3 text-sm">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium text-foreground">{value}</dd></div>)}</dl>;
}
