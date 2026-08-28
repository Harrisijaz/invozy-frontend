import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = { title: "Verify Email", description: "Verify your Smart Invoice email address." };

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Verify your email" description="Use the verification link from your inbox. In dev mode, the returned token can be used here.">
      <Suspense><VerifyEmailForm /></Suspense>
    </AuthCard>
  );
}
