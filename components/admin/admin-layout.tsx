"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { getAdminToken, isAdminUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { useAdmin } from "@/hooks/useAdmin";
import { ErrorState, LoadingState } from "@/components/common/ui";
import { useToast } from "@/components/common/toast";
import { AdminHeader } from "./header";
import { AdminSidebar } from "./sidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const token = typeof window !== "undefined" ? getAdminToken() : null;
  const admin = useAdmin();
  const isPublicAdminRoute = pathname === ROUTES.login || pathname === ROUTES.forgotPassword;

  useEffect(() => {
    if (isPublicAdminRoute) return;
    if (!token) router.replace(ROUTES.login);
  }, [isPublicAdminRoute, router, token]);

  useEffect(() => {
    const handler = () => {
      toast("Your session has expired. Please log in again.", "warning");
      router.replace(ROUTES.login);
    };
    window.addEventListener("invozy-session-expired", handler);
    return () => window.removeEventListener("invozy-session-expired", handler);
  }, [router, toast]);

  if (isPublicAdminRoute) return <>{children}</>;

  if (!token || admin.isLoading) {
    return <main className="min-h-screen bg-background p-6"><LoadingState /></main>;
  }

  if (admin.data && !isAdminUser(admin.data)) {
    return <main className="grid min-h-screen place-items-center bg-background p-6"><ErrorState title="You don't have permission to access this area." description="Backend authorization is required for every admin action." /></main>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader />
        <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
