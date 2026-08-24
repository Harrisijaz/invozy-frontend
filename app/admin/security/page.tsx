import type { Metadata } from "next";
import { SecurityPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Security",
  description: "Manage Invozy security settings, authorization posture, and admin safeguards.",
};

export default function Page() {
  return <SecurityPage />;
}
