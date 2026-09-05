import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Signup", description: "Create your InvoRights account." };

export default function SignupPage() {
  return <AuthCard title="Create your account" description="Start with invoices, quotations, tax support, PDFs, and expense tracking."><SignupForm /></AuthCard>;
}
