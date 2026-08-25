"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

const password = z.string().min(8, "Use at least 8 characters.").regex(/[A-Za-z]/, "Add a letter.").regex(/[0-9]/, "Add a number.");

const loginSchema = z.object({ email: z.email("Enter a valid email."), password: z.string().min(1, "Password is required.") });
const signupSchema = z.object({ name: z.string().min(2, "Full name is required."), email: z.email("Enter a valid email."), password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });
const emailSchema = z.object({ email: z.email("Enter a valid email.") });
const resetSchema = z.object({ password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(() => undefined)}>
      <Field label="Email" error={form.formState.errors.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field>
      <Field label="Password" error={form.formState.errors.password?.message}><Input type="password" autoComplete="current-password" {...form.register("password")} /></Field>
      <div className="flex items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="h-4 w-4 rounded border-border" />Remember me</label><Link href="/forgot-password" className="font-medium text-primary">Forgot password?</Link></div>
      <Button type="submit" className="w-full">Log in</Button>
      <p className="text-center text-sm text-muted-foreground">No account? <Link href="/signup" className="font-medium text-primary">Create one</Link></p>
    </form>
  );
}

export function SignupForm() {
  const form = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema), defaultValues: { name: "", email: "", password: "", confirmPassword: "" } });
  const passwordValue = useWatch({ control: form.control, name: "password" }) ?? "";
  const score = [passwordValue.length >= 8, /[A-Za-z]/.test(passwordValue), /[0-9]/.test(passwordValue)].filter(Boolean).length;
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(() => undefined)}>
      <Field label="Full Name" error={form.formState.errors.name?.message}><Input autoComplete="name" {...form.register("name")} /></Field>
      <Field label="Email" error={form.formState.errors.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field>
      <Field label="Password" error={form.formState.errors.password?.message}><Input type="password" autoComplete="new-password" {...form.register("password")} /></Field>
      <div className="grid grid-cols-3 gap-2" aria-label="Password strength">{[0, 1, 2].map((index) => <span key={index} className={`h-1.5 rounded-full ${index < score ? "bg-primary" : "bg-muted"}`} />)}</div>
      <Field label="Confirm Password" error={form.formState.errors.confirmPassword?.message}><Input type="password" autoComplete="new-password" {...form.register("confirmPassword")} /></Field>
      <Button type="submit" className="w-full">Create Account</Button>
      <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-primary">Log in</Link></p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  return <form className="grid gap-4" onSubmit={form.handleSubmit(() => undefined)}><Field label="Email" error={form.formState.errors.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field><Button type="submit" className="w-full">Send Reset Instructions</Button><Link href="/login" className="text-center text-sm font-medium text-primary">Back to login</Link></form>;
}

export function ResetPasswordForm() {
  const form = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirmPassword: "" } });
  return <form className="grid gap-4" onSubmit={form.handleSubmit(() => undefined)}><Field label="New Password" error={form.formState.errors.password?.message}><Input type="password" autoComplete="new-password" {...form.register("password")} /></Field><Field label="Confirm Password" error={form.formState.errors.confirmPassword?.message}><Input type="password" autoComplete="new-password" {...form.register("confirmPassword")} /></Field><Button type="submit" className="w-full">Reset Password</Button></form>;
}
