import { AdminLayout } from "@/components/admin/admin-layout";

export default function Layout({ children }: LayoutProps<"/admin">) {
  return <AdminLayout>{children}</AdminLayout>;
}
