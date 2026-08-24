import type { Metadata } from "next";
import { SupportPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Support",
  description: "Manage Invozy customer support requests, tickets, and response workflows.",
};

export default function Page() {
  return <SupportPage />;
}
