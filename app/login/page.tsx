import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Login", description: "Log in to your Invozy customer workspace." };

export default function LoginPage() {
  return <AuthCard title="Welcome back" description="Manage invoices, expenses and your business finances from one place."><LoginForm /></AuthCard>;
}
