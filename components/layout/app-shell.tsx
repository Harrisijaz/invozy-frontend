"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MobileBottomNav, Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { getStoredUserInfo, getUserToken } from "@/lib/auth";
import { userInfoToProfile } from "@/src/lib/customer/normalize";
import { useSubscription } from "@/src/hooks/customer/useSubscription";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const subscription = useSubscription();
  const user = useMemo(() => userInfoToProfile(getStoredUserInfo(), subscription.data?.subscription), [subscription.data?.subscription]);

  useEffect(() => {
    if (!getUserToken()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  useEffect(() => {
    const handleExpired = () => router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    window.addEventListener("invorights-user-session-expired", handleExpired);
    return () => window.removeEventListener("invorights-user-session-expired", handleExpired);
  }, [pathname, router]);

  if (!getUserToken()) {
    return <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Redirecting to login...</main>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar plan={subscription.data?.plan ?? "FREE"} />
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-black/40" aria-label="Close navigation" onClick={() => setOpen(false)} type="button" />
            <motion.div className="relative h-full" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ duration: 0.2 }}>
              <Sidebar plan={subscription.data?.plan ?? "FREE"} onNavigate={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="min-w-0 lg:pl-72">
        <TopNavbar user={user} onMenuClick={() => setOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            className="mx-auto w-full max-w-[1600px] px-4 pb-24 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <MobileBottomNav />
      </div>
    </div>
  );
}
