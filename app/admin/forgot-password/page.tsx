"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card, Input } from "@/components/common/ui";
import { useToast } from "@/components/common/toast";
import { ROUTES } from "@/lib/constants";

const schema = z.object({ email: z.email("Enter a valid admin email.") });

export default function ForgotPasswordPage() {
  const toast = useToast();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  const onSubmit = async (values: z.infer<typeof schema>) => {
    void values;
    toast("Admin password reset API is not provided in the current contract.", "warning");
  };
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6">
          <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary"><Mail className="h-5 w-5" /></div>
          <h1 className="text-2xl font-semibold tracking-tight">Forgot Password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your admin email. The backend will send a secure reset email.</p>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? <p className="mt-1 text-sm text-error">{form.formState.errors.email.message}</p> : null}
          </div>
          <Button className="w-full" type="submit" isLoading={form.formState.isSubmitting}>Send Reset Email</Button>
        </form>
        <Link className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" href={ROUTES.login}><ArrowLeft className="h-4 w-4" /> Back to login</Link>
      </Card>
    </main>
  );
}
