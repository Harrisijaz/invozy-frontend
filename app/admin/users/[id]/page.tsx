import type { Metadata } from "next";
import { UserDetailsPage } from "@/components/admin/pages";

export const metadata: Metadata = {
  title: "User Details",
  description: "Review an individual InvoRights user's account details, activity, and billing context.",
};

export default function Page() {
  return <UserDetailsPage />;
}
