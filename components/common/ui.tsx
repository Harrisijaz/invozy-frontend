"use client";

import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, FileSearch, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", isLoading, children, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; isLoading?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "secondary" && "border border-border bg-card text-card-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "danger" && "bg-error text-white hover:opacity-90",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("min-h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20", props.className)} />;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>{children}</div>;
}

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const tone =
    ["Active", "Successful", "Success", "Paid", "Approved", "Resolved", "Refund Completed"].includes(value)
      ? "success"
      : ["Pending", "Trial", "Past Due", "Warning", "Refund Requested", "Open"].includes(value)
        ? "warning"
        : ["Blocked", "Failed", "Overdue", "Rejected", "High", "Refund Failed"].includes(value)
          ? "error"
          : "neutral";
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium",
        tone === "success" && "border-success/25 bg-success/10 text-success",
        tone === "warning" && "border-warning/25 bg-warning/10 text-warning",
        tone === "error" && "border-error/25 bg-error/10 text-error",
        tone === "neutral" && "border-border bg-muted text-muted-foreground",
      )}
    >
      {value}
    </span>
  );
}

export function LoadingState({ label = "Loading information" }: { label?: string }) {
  return (
    <div className="grid gap-3">
      <div className="h-24 animate-pulse rounded-xl bg-muted" />
      <div className="h-24 animate-pulse rounded-xl bg-muted" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
      <FileSearch className="h-8 w-8 text-muted-foreground" />
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description = "We couldn't load this information.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
      <AlertCircle className="h-8 w-8 text-error" />
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? <Button className="mt-4" variant="secondary" onClick={onRetry}>Retry</Button> : null}
    </div>
  );
}

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel, loading }: { open: boolean; title: string; description: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void; loading?: boolean }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
          <motion.div initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 8 }} className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={onCancel}>Cancel</Button>
              <Button variant="danger" isLoading={loading} onClick={onConfirm}>{confirmLabel}</Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
