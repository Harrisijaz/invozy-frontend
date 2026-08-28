"use client";

import Link from "next/link";
import { Bot, FilePlus2, ReceiptText, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UsageCard } from "@/components/shared/usage-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { summaryToCards } from "@/src/lib/customer/normalize";
import { useDashboard } from "@/src/hooks/customer/useDashboard";

const actions = [
  { label: "Create Invoice", href: "/app/invoices/new", icon: FilePlus2 },
  { label: "Create Quotation", href: "/app/quotations/new", icon: ReceiptText },
  { label: "Generate with AI", href: "/app/invoices/new?mode=ai", icon: Bot },
  { label: "Add Expense", href: "/app/expenses", icon: Wallet },
] as const;

export default function DashboardPage() {
  const dashboard = useDashboard();
  if (dashboard.isLoading) return <Card>Loading dashboard...</Card>;
  if (dashboard.isError || !dashboard.data) return <Card>Unable to load dashboard from the gateway.</Card>;

  const { user, usage, invoices, quotations, summary } = dashboard.data;
  const finance = summaryToCards(summary);
  const income = finance.income || invoices.filter((item) => item.status === "PAID").reduce((sum, item) => sum + item.amount, 0);
  const expenses = finance.expenses;
  const cards = [
    ["Total Income", income],
    ["Total Expenses", expenses],
    ["Savings", finance.savings || income - expenses],
    ["Outstanding", invoices.filter((item) => item.status === "UNPAID" || item.status === "PAYMENT_PROCESSING").reduce((sum, item) => sum + item.amount, 0)],
  ] as const;

  return (
    <div className="grid gap-6">
      <PageHeader title={`Welcome back, ${user.name}`} description="A focused view of invoices, expenses, savings, and plan usage." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Button key={action.href} asChild href={action.href} variant="secondary" className="min-h-14 justify-start">
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{formatCurrency(value)}</p>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="min-w-0">
          <h2 className="text-base font-semibold">Recent Activity</h2>
          <div className="mt-4 grid gap-3">
            {[...invoices.slice(0, 3), ...quotations.slice(0, 1)].map((item) => (
              <Link key={item.id} href={item.number.startsWith("INV") ? `/app/invoices/${item.id}` : `/app/quotations/${item.id}`} className="grid gap-2 rounded-lg border border-border p-3 transition hover:bg-muted sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.number} - {item.client.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.issueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatCurrency(item.amount, item.currency)}</span>
                  <StatusBadge value={item.status} tone={item.status === "PAID" ? "success" : item.status === "DELETED" ? "error" : "warning"} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <UsageCard usage={usage} paid={user.plan === "PAID"} />
      </section>
    </div>
  );
}
