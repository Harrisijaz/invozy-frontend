import { api } from "@/lib/api";
import type {
  BlogAdminFilters,
  BlogPageResponse,
  BlogPostAdminResponse,
  BlogPostPayload,
  BlogStatus,
  CategoryPayload,
  CategoryResponse,
  TagResponse,
  UploadResponse,
} from "@/types/admin/blog";

const basePath = "/api/admin/blog";

function cleanParams(params: BlogAdminFilters = {}) {
  return Object.fromEntries(Object.entries({
    page: params.page ?? 0,
    size: params.size ?? 10,
    sort: params.sort ?? "createdAt,desc",
    status: params.status || undefined,
    category: params.category || undefined,
    tag: params.tag || undefined,
    search: params.search || undefined,
    createdBy: params.createdBy || undefined,
    publishedFrom: params.publishedFrom || undefined,
    publishedTo: params.publishedTo || undefined,
  }).filter(([, value]) => value !== undefined && value !== ""));
}

export const adminBlogService = {
  async getPosts(params: BlogAdminFilters = {}) {
    const { data } = await api.get<BlogPageResponse<BlogPostAdminResponse>>(`${basePath}/posts`, { params: cleanParams(params) });
    return data;
  },

  async getPost(id: string) {
    const { data } = await api.get<BlogPostAdminResponse>(`${basePath}/posts/${id}`);
    return data;
  },

  async createPost(payload: BlogPostPayload) {
    const { data } = await api.post<BlogPostAdminResponse>(`${basePath}/posts`, payload);
    return data;
  },

  async updatePost(id: string, payload: BlogPostPayload) {
    const { data } = await api.put<BlogPostAdminResponse>(`${basePath}/posts/${id}`, payload);
    return data;
  },

  async updateStatus(id: string, status: BlogStatus) {
    const { data } = await api.patch<BlogPostAdminResponse>(`${basePath}/posts/${id}/status`, { status });
    return data;
  },

  async archivePost(id: string) {
    const { data } = await api.delete<BlogPostAdminResponse>(`${basePath}/posts/${id}`);
    return data;
  },

  async getCategories() {
    const { data } = await api.get<CategoryResponse[]>(`${basePath}/categories`);
    return data;
  },

  async createCategory(payload: CategoryPayload) {
    const { data } = await api.post<CategoryResponse>(`${basePath}/categories`, payload);
    return data;
  },

  async updateCategory(id: string, payload: CategoryPayload) {
    const { data } = await api.put<CategoryResponse>(`${basePath}/categories/${id}`, payload);
    return data;
  },

  async deleteCategory(id: string) {
    const { data } = await api.delete<unknown>(`${basePath}/categories/${id}`);
    return data;
  },

  async getTags() {
    const { data } = await api.get<TagResponse[]>(`${basePath}/tags`);
    return data;
  },

  async createTag(name: string) {
    const { data } = await api.post<TagResponse>(`${basePath}/tags`, { name });
    return data;
  },

  async uploadCover(file: File, altText: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText);
    const { data } = await api.post<UploadResponse>(`${basePath}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async revalidate(paths: string[]) {
    const { data } = await api.post<unknown>(`${basePath}/revalidate`, { paths });
    return data;
  },
};
