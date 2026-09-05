import type { Metadata } from "next";
import { UsersPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage InvoRights users, roles, account status, and customer records.",
};

export default function Page() {
  return <UsersPage />;
}
