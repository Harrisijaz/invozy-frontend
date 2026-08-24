import type { Metadata } from "next";
import { BillingPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Billing",
  description: "Track Invozy payments, invoices, revenue, and billing operations.",
};

export default function Page() {
  return <BillingPage />;
}
