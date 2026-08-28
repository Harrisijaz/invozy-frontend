import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Reset Password", description: "Choose a new Invozy password." };

export default function ResetPasswordPage() {
  return <AuthCard title="Choose a new password" description="Use a strong password with at least one letter and one number."><Suspense><ResetPasswordForm /></Suspense></AuthCard>;
}
