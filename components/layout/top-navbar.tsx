"use client";

import { Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { UserProfile } from "@/src/types/customer";

export function TopNavbar({ user, onMenuClick }: { user: UserProfile; onMenuClick: () => void }) {
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
      <button type="button" className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">Customer workspace</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <Link href="/app/settings/profile" aria-label="View and edit profile" className="hidden items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex">
          {user.avatarUrl ? (
            <div className="h-8 w-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${user.avatarUrl}")` }} aria-hidden="true" />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{initials || <UserRound className="h-4 w-4" />}</div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
