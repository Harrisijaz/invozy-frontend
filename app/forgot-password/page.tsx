import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Forgot Password", description: "Reset your InvoRights password." };

export default function ForgotPasswordPage() {
  return <AuthCard title="Reset your password" description="Enter your email and check your inbox for password reset instructions."><ForgotPasswordForm /></AuthCard>;
}
