import type { Metadata } from "next";
import { AdminBlogEditPage } from "@/components/admin/blog-pages";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  description: "Edit an InvoRights blog post with optimistic locking.",
};

export default function Page() {
  return <AdminBlogEditPage />;
}
