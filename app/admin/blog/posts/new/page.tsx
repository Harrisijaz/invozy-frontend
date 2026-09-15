import type { Metadata } from "next";
import { AdminBlogNewPage } from "@/components/admin/blog-pages";

export const metadata: Metadata = {
  title: "New Blog Post",
  description: "Create a new InvoRights blog post.",
};

export default function Page() {
  return <AdminBlogNewPage />;
}
