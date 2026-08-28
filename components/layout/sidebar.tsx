"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, FileText, LayoutDashboard, LogOut, ReceiptText, Settings, TrendingUp, Wallet } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { PlanBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
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

export function Sidebar({ plan, onNavigate }: { plan: PlanCode; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await authService.logout();
    router.replace("/login");
  };
  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center px-5">
        <BrandLogo href="/app/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                active && "bg-primary/10 text-primary",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Plan</span>
            <PlanBadge plan={plan} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{plan === "PAID" ? "$12/month" : "5 invoices lifetime"}</p>
          {plan === "FREE" ? <Button asChild href="/app/subscription" className="mt-3 w-full" size="sm">Upgrade to Paid</Button> : null}
        </div>
        <button className="mt-3 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground" type="button" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
