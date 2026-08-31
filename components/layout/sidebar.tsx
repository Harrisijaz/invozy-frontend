"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, FileText, LayoutDashboard, LogOut, ReceiptText, Settings, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { PlanBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { isPaidPlan } from "@/src/lib/customer/plans";
import { authService } from "@/src/services/customer/auth.service";
import type { PlanCode } from "@/src/types/customer";

const navItems = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Invoices", href: "/app/invoices", icon: FileText },
  { label: "Quotations", href: "/app/quotations", icon: ReceiptText },
  { label: "Expenses", href: "/app/expenses", icon: Wallet },
  { label: "Income", href: "/app/income", icon: TrendingUp },
  { label: "Financial Reports", href: "/app/financial-reports", icon: BarChart3 },
  { label: "Subscription", href: "/app/subscription", icon: CreditCard },
  { label: "Settings", href: "/app/settings", icon: Settings },
] as const;

const mobileNavItems = [
  { label: "Home", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Invoices", href: "/app/invoices", icon: FileText },
  { label: "Quotes", href: "/app/quotations", icon: ReceiptText },
  { label: "Expenses", href: "/app/expenses", icon: Wallet },
  { label: "Settings", href: "/app/settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ plan, onNavigate }: { plan: PlanCode; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await authService.logout();
    router.replace("/login");
  };
  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-card shadow-sm">
      <div className="flex h-16 items-center border-b border-border px-5">
        <BrandLogo href="/app/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground",
                active && "bg-primary/10 text-primary shadow-sm hover:bg-primary/10 hover:text-primary",
              )}
            >
              <span className={cn("grid h-8 w-8 place-items-center rounded-md bg-muted text-muted-foreground transition duration-200 group-hover:bg-card group-hover:text-foreground", active && "bg-primary text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground")}>
                <item.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 truncate">{item.label}</span>
              {active ? <span className="absolute right-2 h-6 w-1 rounded-full bg-primary" /> : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-lg border border-border bg-background p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/35">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Plan</span>
            <PlanBadge plan={plan} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{isPaidPlan(plan) ? "$15/month" : "5 invoices lifetime"}</p>
          {plan === "FREE" ? <Button asChild href="/app/subscription" className="mt-3 w-full" size="sm"><Sparkles className="h-4 w-4" />Upgrade</Button> : null}
        </div>
        <button className="mt-3 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground" type="button" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileNavItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium text-muted-foreground transition duration-200 active:scale-95",
                active && "bg-primary/10 text-primary",
              )}
            >
              <item.icon className={cn("h-5 w-5 transition duration-200", active && "scale-110")} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
