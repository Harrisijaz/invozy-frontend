import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Customer Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CustomerAppLayout({ children }: LayoutProps<"/app">) {
  return <AppShell>{children}</AppShell>;
}
