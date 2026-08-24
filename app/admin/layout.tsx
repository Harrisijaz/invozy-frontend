import type { Metadata } from "next";
import { AdminLayout } from "@/components/admin/admin-layout";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function Layout({ children }: LayoutProps<"/admin">) {
  return <AdminLayout>{children}</AdminLayout>;
}
