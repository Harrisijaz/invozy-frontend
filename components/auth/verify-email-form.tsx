"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { authService } from "@/src/services/customer/auth.service";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [devToken, setDevToken] = useState(searchParams.get("code"));
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!email.trim()) {
      toast("Email is required.", "error");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      toast("Enter the 6-digit verification code.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.verifyEmail({ email: email.trim(), code });
      toast(response.message, "success");
      router.replace("/login");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email.trim()) {
      toast("Email is required.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.resendVerification(email.trim());
      setDevToken(response.devToken ?? null);
      if (response.devToken) setCode(response.devToken);
      toast(response.message, "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      {devToken ? <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Dev verification code: <span className="font-medium text-foreground">{devToken}</span></p> : null}
      <Field label="Email"><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
      <Field label="Verification Code"><Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} /></Field>
      <Button type="button" onClick={verify} isLoading={loading} className="w-full">Verify Email</Button>
      <Button type="button" variant="secondary" onClick={resend} isLoading={loading} className="w-full">Resend Code</Button>
      <Link href="/login" className="text-center text-sm font-medium text-primary">Back to login</Link>
    </div>
  );
}
