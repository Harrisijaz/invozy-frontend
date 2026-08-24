import type { Metadata } from "next";
import { SubscriptionsPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Review and manage Invozy subscription plans, renewals, and account entitlements.",
};

export default function Page() {
  return <SubscriptionsPage />;
}
