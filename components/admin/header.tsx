"use client";

import { Bell, Search, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/common/ui";
import { ThemeSwitcher } from "./theme-switcher";
import { InvoRightsLogo } from "./logo";
import { MobileAdminMenu } from "./sidebar";

function titleFromPath(pathname: string) {
  const leaf = pathname.split("/").filter(Boolean).at(-1) ?? "dashboard";
  if (leaf.startsWith("usr_")) return "User Details";
  return leaf.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = titleFromPath(pathname);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <MobileAdminMenu />
        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="text-xs text-muted-foreground">Admin / {title}</p>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
          <InvoRightsLogo compact />
          <span className="truncate text-sm font-semibold text-muted-foreground">{title}</span>
        </div>
        <label className="relative hidden w-full max-w-md xl:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search users, payments, activity" aria-label="Search admin data" />
        </label>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground" aria-label="Notifications"><Bell className="h-4 w-4" /></button>
        <div className="hidden md:block"><ThemeSwitcher compact /></div>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground" aria-label="Admin profile"><UserRound className="h-4 w-4" /></button>
      </div>
    </header>
  );
}
