import type { Metadata } from "next";
import { AdminBlogTaxonomyPage } from "@/components/admin/blog-pages";

export const metadata: Metadata = {
  title: "Blog Taxonomy",
  description: "Manage InvoRights blog categories and tags.",
};

export default function Page() {
  return <AdminBlogTaxonomyPage />;
}
