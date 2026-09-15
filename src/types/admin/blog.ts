export type BlogStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED";
export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type BlogBlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "bulletList"
  | "numberedList"
  | "quote"
  | "code"
  | "table"
  | "callout"
  | "productCTA";

export type BlogBlock = {
  type: BlogBlockType;
  order: number;
  data: Record<string, unknown>;
};

export type ProductLink = {
  label: string;
  href: string;
  order: number;
};

export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: CategoryStatus;
  publishedPostCount: number;
};

export type TagResponse = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPostAdminResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorName?: string;
  category?: CategoryResponse;
  tags: TagResponse[];
  estimatedReadTime: string;
  status: BlogStatus;
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  archivedAt?: string;
  archivedBy?: string;
  version: number;
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

export type BlogAdminFilters = {
  status?: BlogStatus | "";
  category?: string;
  tag?: string;
  search?: string;
  createdBy?: string;
  publishedFrom?: string;
  publishedTo?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export type BlogPostPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorName?: string;
  categoryId?: string;
  tagIds: string[];
  body: BlogBlock[];
  productLinks: ProductLink[];
  status: BlogStatus;
  version?: number;
};

export type CategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  status: CategoryStatus;
};

export type BlogApiErrorBody = {
  code?: string;
  message?: string;
  timestamp?: string;
  fields?: Record<string, string>;
};

export type UploadResponse = {
  url: string;
  altText: string;
};
