"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminBlogService } from "@/services/admin/blog.service";
import type { BlogAdminFilters, BlogPostPayload, BlogStatus, CategoryPayload } from "@/types/admin/blog";

export function useAdminBlogPosts(params: BlogAdminFilters) {
  return useQuery({
    queryKey: ["admin-blog-posts", params],
    queryFn: () => adminBlogService.getPosts(params),
  });
}

export function useAdminBlogPost(id: string) {
  return useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: () => adminBlogService.getPost(id),
    enabled: Boolean(id),
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BlogPostPayload) => adminBlogService.createPost(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BlogPostPayload }) => adminBlogService.updatePost(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-post", variables.id] });
    },
  });
}

export function useUpdateBlogStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BlogStatus }) => adminBlogService.updateStatus(id, status),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-post", variables.id] });
    },
  });
}

export function useArchiveBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminBlogService.archivePost(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-post", id] });
    },
  });
}

export function useAdminBlogCategories() {
  return useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: adminBlogService.getCategories,
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => adminBlogService.createCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) => adminBlogService.updateCategory(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminBlogService.deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
    },
  });
}

export function useAdminBlogTags() {
  return useQuery({
    queryKey: ["admin-blog-tags"],
    queryFn: adminBlogService.getTags,
  });
}

export function useCreateBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => adminBlogService.createTag(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog-tags"] });
    },
  });
}

export function useUploadBlogCover() {
  return useMutation({
    mutationFn: ({ file, altText }: { file: File; altText: string }) => adminBlogService.uploadCover(file, altText),
  });
}

export function useRevalidateBlog() {
  return useMutation({
    mutationFn: (paths: string[]) => adminBlogService.revalidate(paths),
  });
}
