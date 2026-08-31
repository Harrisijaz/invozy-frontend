"use client";

import Link from "next/link";
import { ArrowRight, Bot, DollarSign, FilePlus2, ReceiptText, TrendingDown, TrendingUp, Wallet } from "lucide-react";
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
    ["Total Income", income, TrendingUp, "text-success"],
    ["Total Expenses", expenses, TrendingDown, "text-error"],
    ["Savings", finance.savings || income - expenses, DollarSign, "text-primary"],
    ["Outstanding", invoices.filter((item) => item.status === "UNPAID" || item.status === "PAYMENT_PROCESSING").reduce((sum, item) => sum + item.amount, 0), Wallet, "text-warning"],
  ] as const;

  return (
    <div className="grid gap-6">
      <PageHeader title={`Welcome back, ${user.name}`} description="A focused view of invoices, expenses, savings, and plan usage." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Button key={action.href} asChild href={action.href} variant="secondary" className="group min-h-14 justify-between px-4">
            <span className="inline-flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary transition duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                <action.icon className="h-4 w-4" />
              </span>
              {action.label}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
          </Button>
        ))}
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon, tone]) => (
          <Card key={label} className="group hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(value)}</p>
              </div>
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-muted transition duration-200 group-hover:scale-105 group-hover:bg-primary/10">
                <Icon className={`h-5 w-5 ${tone}`} />
              </div>
            </div>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Recent Activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest invoices and quotations from your workspace.</p>
            </div>
            <Link href="/app/invoices" className="hidden text-sm font-medium text-primary transition hover:-translate-y-0.5 sm:inline-block">View all</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {[...invoices.slice(0, 3), ...quotations.slice(0, 1)].map((item) => (
              <Link key={item.id} href={item.number.startsWith("INV") ? `/app/invoices/${item.id}` : `/app/quotations/${item.id}`} className="grid gap-2 rounded-lg border border-border p-3 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-muted/60 sm:grid-cols-[1fr_auto] sm:items-center">
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
