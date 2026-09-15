import type { Metadata } from "next";
import { AdminBlogPostsPage } from "@/components/admin/blog-pages";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Manage InvoRights blog posts, drafts, publishing, and archive workflow.",
};

export default function Page() {
  return <AdminBlogPostsPage />;
}
