import type { Metadata } from "next";
import { ActivityLogsPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Activity Logs",
  description: "Audit Invozy admin actions, user events, and security-relevant platform activity.",
};

export default function Page() {
  return <ActivityLogsPage />;
}
