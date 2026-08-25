import { cn } from "@/lib/utils";

const tones = {
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  error: "border-error/25 bg-error/10 text-error",
  neutral: "border-border bg-muted text-muted-foreground",
  primary: "border-primary/25 bg-primary/10 text-primary",
};

export function StatusBadge({ value, tone = "neutral" }: { value: string; tone?: keyof typeof tones }) {
  return <span className={cn("inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium", tones[tone])}>{value}</span>;
}

export function PlanBadge({ plan }: { plan: "FREE" | "PAID" }) {
  return <StatusBadge value={plan} tone={plan === "PAID" ? "primary" : "neutral"} />;
}
