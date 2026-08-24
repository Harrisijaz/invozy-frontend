import type { Metadata } from "next";
import { AIUsagePage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "AI Usage",
  description: "Monitor Invozy AI usage, costs, limits, and product consumption patterns.",
};

export default function Page() {
  return <AIUsagePage />;
}
