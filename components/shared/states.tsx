"use client";

import { AlertCircle, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <FileSearch className="h-8 w-8 text-muted-foreground" />
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title = "Unable to load this page", description = "Please try again.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
      <AlertCircle className="h-8 w-8 text-error" />
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {onRetry ? <Button className="mt-5" variant="secondary" onClick={onRetry}>Try Again</Button> : null}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="h-20 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
