import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function UsageProgress({ label, used, limit, scope }: { label: string; used: number; limit: number | null; scope: string }) {
  const percent = limit ? Math.min(100, Math.round((used / limit) * 100)) : 100;
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{limit === null ? "Unlimited" : `${used} / ${limit} ${scope}`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full bg-primary transition-all", limit === null && "bg-success")} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function UsageCard({ usage, paid = false }: { usage: { invoicesUsedLifetime: number; aiUsedLifetime: number; expensesUsedThisMonth: number }; paid?: boolean }) {
  return (
    <Card className="grid gap-4">
      <div>
        <h2 className="text-base font-semibold">Subscription Usage</h2>
        <p className="mt-1 text-sm text-muted-foreground">Free limits are lifetime for invoices and AI, monthly for expenses.</p>
      </div>
      <UsageProgress label="Invoices" used={usage.invoicesUsedLifetime} limit={paid ? null : 5} scope="lifetime" />
      <UsageProgress label="AI" used={usage.aiUsedLifetime} limit={paid ? null : 2} scope="lifetime" />
      <UsageProgress label="Expenses" used={usage.expensesUsedThisMonth} limit={paid ? null : 10} scope="this month" />
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
        <span className="font-medium">Finance Graphs</span>
        <span className={cn("font-medium", paid ? "text-success" : "text-muted-foreground")}>{paid ? "Included" : "Upgrade required"}</span>
      </div>
    </Card>
  );
}
