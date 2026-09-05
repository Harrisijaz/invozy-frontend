import type { Metadata } from "next";
import { ModerationPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Moderation",
  description: "Review and moderate InvoRights platform content, reports, and policy actions.",
};

export default function Page() {
  return <ModerationPage />;
}
