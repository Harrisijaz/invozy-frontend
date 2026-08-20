"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BarChart3, Bot, CreditCard, Gauge, LifeBuoy, LogOut, Menu, Shield, UserCog, Users, X } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useAdmin";
import { Button } from "@/components/common/ui";
import { useToast } from "@/components/common/toast";
import { InvozyLogo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";

const sections = [
  { label: "Overview", items: [{ href: ROUTES.dashboard, label: "Dashboard", icon: Gauge }] },
  { label: "Management", items: [{ href: ROUTES.users, label: "Users", icon: Users }, { href: ROUTES.subscriptions, label: "Subscriptions", icon: UserCog }, { href: ROUTES.billing, label: "Billing", icon: CreditCard }] },
  { label: "Analytics", items: [{ href: ROUTES.analytics, label: "Revenue", icon: BarChart3 }, { href: ROUTES.aiUsage, label: "AI Usage", icon: Bot }] },
  { label: "Support", items: [{ href: ROUTES.support, label: "Support", icon: LifeBuoy }, { href: ROUTES.moderation, label: "Moderation", icon: Shield }] },
  { label: "Security", items: [{ href: ROUTES.activityLogs, label: "Activity Logs", icon: Activity }, { href: ROUTES.security, label: "Security", icon: Shield }] },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const toast = useToast();
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast("Logged out securely", "success");
        router.replace(ROUTES.login);
      },
    });
  };
  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border px-5 py-4"><InvozyLogo /></div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{section.label}</p>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("group relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition", active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                    {active ? <motion.span layoutId="active-admin-route" className="absolute inset-y-2 left-0 w-1 rounded-full bg-primary" /> : null}
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="space-y-3 border-t border-border p-4">
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="text-sm font-semibold text-foreground">Haris</p>
          <p className="truncate text-xs text-muted-foreground">SUPER_ADMIN</p>
        </div>
        <ThemeSwitcher />
        <Button variant="secondary" className="w-full justify-start" onClick={handleLogout} isLoading={logout.isPending}><LogOut className="h-4 w-4" /> Logout</Button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-card lg:block"><SidebarContent /></aside>;
}

export function MobileAdminMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card lg:hidden" onClick={() => setOpen(true)} aria-label="Open admin navigation"><Menu className="h-5 w-5" /></button>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close navigation overlay" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", stiffness: 340, damping: 32 }} className="relative h-full w-[min(20rem,88vw)] border-r border-border bg-card shadow-2xl">
              <button className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card" onClick={() => setOpen(false)} aria-label="Close admin navigation"><X className="h-4 w-4" /></button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
