import type { Metadata } from "next";
import { AnalyticsPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analyze InvoRights revenue, user engagement, and platform performance metrics.",
};

export default function Page() {
  return <AnalyticsPage />;
}
