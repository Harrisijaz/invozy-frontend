"use client";

import { Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { UserProfile } from "@/src/types/customer";

const routeTitles = [
  ["/app/dashboard", "Dashboard"],
  ["/app/invoices", "Invoices"],
  ["/app/quotations", "Quotations"],
  ["/app/expenses", "Expenses"],
  ["/app/income", "Income"],
  ["/app/financial-reports", "Financial Reports"],
  ["/app/subscription", "Subscription"],
  ["/app/settings", "Settings"],
] as const;

export function TopNavbar({ user, onMenuClick }: { user: UserProfile; onMenuClick: () => void }) {
  const pathname = usePathname();
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const title = routeTitles.find(([href]) => pathname === href || pathname.startsWith(`${href}/`))?.[1] ?? "Customer Workspace";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 shadow-sm backdrop-blur sm:px-6">
      <button type="button" className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card transition duration-200 hover:-translate-y-0.5 hover:bg-muted lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">Customer workspace</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <Link href="/app/settings/profile" aria-label="View and edit profile" className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card transition duration-200 hover:-translate-y-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-auto sm:w-auto sm:grid-cols-[auto_1fr] sm:gap-3 sm:px-3 sm:py-2">
          {user.avatarUrl ? (
            <div className="h-8 w-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${user.avatarUrl}")` }} aria-hidden="true" />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{initials || <UserRound className="h-4 w-4" />}</div>
          )}
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
