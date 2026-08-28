"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { getCustomerApiErrorCode, getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { authService } from "@/src/services/customer/auth.service";

const fullName = z
  .string()
  .trim()
  .min(1, "Full name is required.")
  .max(100, "Use 100 characters or fewer.")
  .regex(/^[A-Za-z\s'-]+$/, "Use letters, spaces, hyphens, or apostrophes.");
const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/[0-9]/, "Add a number.")
  .regex(/[^A-Za-z0-9]/, "Add a special character.");

const loginSchema = z.object({ email: z.email("Enter a valid email.").max(254, "Use 254 characters or fewer."), password: z.string().min(1, "Password is required.") });
const signupSchema = z
  .object({
    name: fullName,
    email: z.email("Enter a valid email.").max(254, "Use 254 characters or fewer."),
    password,
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(Boolean, "Accept the terms to continue."),
  })
  .refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." })
  .refine((data) => !data.password.toLowerCase().includes(data.email.toLowerCase()), { path: ["password"], message: "Password must not contain your email." });
const emailSchema = z.object({ email: z.email("Enter a valid email.").max(254, "Use 254 characters or fewer.") });
const resetSchema = z.object({ password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const submitLogin = form.handleSubmit(async (values) => {
    try {
      const response = await authService.login(values);
      toast(response.message, "success");
      router.replace(searchParams.get("next") || "/app/dashboard");
    } catch (error) {
      if (getCustomerApiErrorCode(error) === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(values.email);
      }
      toast(getCustomerApiErrorMessage(error), "error");
    }
  });
  if (unverifiedEmail) {
    return (
      <div className="grid gap-4">
        <VerifyEmailInlineForm email={unverifiedEmail} />
        <Button type="button" variant="ghost" className="w-full" onClick={() => setUnverifiedEmail("")}>Back to login</Button>
      </div>
    );
  }
  return (
    <form className="grid gap-4" onSubmit={submitLogin}>
      <Field label="Email" error={form.formState.errors.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field>
      <Field label="Password" error={form.formState.errors.password?.message}><Input type="password" autoComplete="current-password" {...form.register("password")} /></Field>
      <div className="flex items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="h-4 w-4 rounded border-border" />Remember me</label><Link href="/forgot-password" className="font-medium text-primary">Forgot password?</Link></div>
      <Button type="submit" className="w-full" isLoading={form.formState.isSubmitting}>Log in</Button>
      <p className="text-center text-sm text-muted-foreground">No account? <Link href="/signup" className="font-medium text-primary">Create one</Link></p>
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  const toast = useToast();
  const form = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema), defaultValues: { name: "", email: "", password: "", confirmPassword: "", termsAccepted: false } });
  const passwordValue = useWatch({ control: form.control, name: "password" }) ?? "";
  const score = [passwordValue.length >= 8, /[A-Z]/.test(passwordValue), /[a-z]/.test(passwordValue), /[0-9]/.test(passwordValue), /[^A-Za-z0-9]/.test(passwordValue)].filter(Boolean).length;
  const submit = form.handleSubmit(async ({ name, email, password, termsAccepted }) => {
    try {
      const response = await authService.signup({ fullName: name.trim(), email: email.trim(), password, termsAccepted });
      toast(response.message, "success");
      const params = new URLSearchParams({ email: email.trim() });
      if (response.devToken) params.set("code", response.devToken);
      router.push(`/verify-email?${params.toString()}`);
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  });
  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Field label="Full Name" error={form.formState.errors.name?.message}><Input autoComplete="name" {...form.register("name")} /></Field>
      <Field label="Email" error={form.formState.errors.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field>
      <Field label="Password" error={form.formState.errors.password?.message}><Input type="password" autoComplete="new-password" {...form.register("password")} /></Field>
      <div className="grid grid-cols-5 gap-2" aria-label="Password strength">{[0, 1, 2, 3, 4].map((index) => <span key={index} className={`h-1.5 rounded-full ${index < score ? "bg-primary" : "bg-muted"}`} />)}</div>
      <Field label="Confirm Password" error={form.formState.errors.confirmPassword?.message}><Input type="password" autoComplete="new-password" {...form.register("confirmPassword")} /></Field>
      <label className="flex items-start gap-2 text-sm text-muted-foreground"><input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border" {...form.register("termsAccepted")} />I accept the terms and conditions.</label>
      {form.formState.errors.termsAccepted?.message ? <p className="text-sm text-error">{form.formState.errors.termsAccepted.message}</p> : null}
      <Button type="submit" className="w-full" isLoading={form.formState.isSubmitting}>Create Account</Button>
      <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-primary">Log in</Link></p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const toast = useToast();
  const form = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  const [devToken, setDevToken] = useState<string | null>(null);
  const submit = form.handleSubmit(async ({ email }) => {
    try {
      const response = await authService.forgotPassword(email);
      setDevToken(response.devToken ?? null);
      toast(response.message, "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  });
  return <form className="grid gap-4" onSubmit={submit}>{devToken ? <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Dev reset token: <span className="font-medium text-foreground">{devToken}</span></p> : null}<Field label="Email" error={form.formState.errors.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field><Button type="submit" className="w-full" isLoading={form.formState.isSubmitting}>Send Reset Instructions</Button><Link href="/login" className="text-center text-sm font-medium text-primary">Back to login</Link></form>;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const form = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirmPassword: "" } });
  const submit = form.handleSubmit(async ({ password }) => {
    const token = searchParams.get("token");
    if (!token) {
      toast("Reset token is missing.", "error");
      return;
    }
    try {
      const response = await authService.resetPassword({ token, newPassword: password });
      toast(response.message ?? "Password reset successfully.", "success");
      router.replace("/login");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  });
  return <form className="grid gap-4" onSubmit={submit}><Field label="New Password" error={form.formState.errors.password?.message}><Input type="password" autoComplete="new-password" {...form.register("password")} /></Field><Field label="Confirm Password" error={form.formState.errors.confirmPassword?.message}><Input type="password" autoComplete="new-password" {...form.register("confirmPassword")} /></Field><Button type="submit" className="w-full" isLoading={form.formState.isSubmitting}>Reset Password</Button></form>;
}

function VerifyEmailInlineForm({ email }: { email: string }) {
  const router = useRouter();
  const toast = useToast();
  const [code, setCode] = useState("");
  const [devToken, setDevToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!/^\d{6}$/.test(code)) {
      toast("Enter the 6-digit verification code.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.verifyEmail({ email, code });
      toast(response.message, "success");
      router.replace("/login");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setLoading(true);
    try {
      const response = await authService.resendVerification(email);
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
      <Field label="Verification Code"><Input inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} /></Field>
      <Button type="button" onClick={verify} isLoading={loading} className="w-full">Verify Email</Button>
      <Button type="button" variant="secondary" onClick={resend} isLoading={loading} className="w-full">Resend Code</Button>
    </div>
  );
}
