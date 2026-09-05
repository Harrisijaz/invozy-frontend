import type { Metadata } from "next";
import { DashboardPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Monitor InvoRights platform health, revenue, user growth, and operational activity.",
};

export default function Page() {
  return <DashboardPage />;
}
