"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card, Input } from "@/components/common/ui";
import { useToast } from "@/components/common/toast";
import { useLogin } from "@/hooks/useAdmin";
import { ROUTES } from "@/lib/constants";

const schema = z.object({
  email: z.email("Enter a valid admin email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useLogin();
  const toast = useToast();
  const form = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: "admin@invozy.com", password: "password123" } });
  const onSubmit = (values: LoginValues) => {
    login.mutate(values, {
      onSuccess: () => {
        toast("Signed in successfully", "success");
        router.replace(ROUTES.dashboard);
      },
      onError: () => toast("Something went wrong", "error"),
    });
  };
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Image src="/brand/invozy-logo.png" alt="Invozy Logo" width={190} height={70} className="mx-auto h-16 w-auto object-contain" priority />
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-primary">Admin access only</p>
        </div>
        <Card className="p-6">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary"><LockKeyhole className="h-5 w-5" /></div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Portal</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in with your administrator credentials.</p>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
              {form.formState.errors.email ? <p className="mt-1 text-sm text-error">{form.formState.errors.email.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
              {form.formState.errors.password ? <p className="mt-1 text-sm text-error">{form.formState.errors.password.message}</p> : null}
            </div>
            <Button className="w-full" type="submit" isLoading={login.isPending}>Sign In</Button>
          </form>
          <Link className="mt-4 block text-center text-sm font-medium text-primary hover:underline" href={ROUTES.forgotPassword}>Forgot Password?</Link>
        </Card>
      </div>
    </main>
  );
}
