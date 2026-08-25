import Link from "next/link";
import { Bot, FilePlus2, ReceiptText, Wallet } from "lucide-react";
import { IncomeExpenseChart, InvoiceStatusChart } from "@/components/financial/financial-charts";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UsageCard } from "@/components/shared/usage-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockExpenses, mockInvoices, mockQuotations, mockUsage, mockUser } from "@/src/mocks/customer/data";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";

const actions = [
  { label: "Create Invoice", href: "/app/invoices/new", icon: FilePlus2 },
  { label: "Create Quotation", href: "/app/quotations/new", icon: ReceiptText },
  { label: "Generate with AI", href: "/app/invoices/new?mode=ai", icon: Bot },
  { label: "Add Expense", href: "/app/expenses", icon: Wallet },
] as const;

export default function DashboardPage() {
  const paid = mockInvoices.filter((item) => item.status === "PAID");
  const income = paid.reduce((sum, item) => sum + item.amount, 0);
  const expenses = mockExpenses.reduce((sum, item) => sum + item.amount, 0);
  const cards = [
    ["Total Income", income],
    ["Total Expenses", expenses],
    ["Savings", income - expenses],
    ["Outstanding", mockInvoices.filter((item) => item.status === "UNPAID" || item.status === "OVERDUE").reduce((sum, item) => sum + item.amount, 0)],
  ] as const;

  return (
    <div className="grid gap-6">
      <PageHeader title={`Welcome back, ${mockUser.name}`} description="A focused view of invoices, expenses, savings, and plan usage." />
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
      <section className="grid min-w-0 gap-4 xl:grid-cols-[1fr_380px]">
        <IncomeExpenseChart />
        <InvoiceStatusChart />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="min-w-0">
          <h2 className="text-base font-semibold">Recent Activity</h2>
          <div className="mt-4 grid gap-3">
            {[...mockInvoices.slice(0, 3), ...mockQuotations.slice(0, 1)].map((item) => (
              <Link key={item.id} href={item.number.startsWith("INV") ? `/app/invoices/${item.id}` : `/app/quotations/${item.id}`} className="grid gap-2 rounded-lg border border-border p-3 transition hover:bg-muted sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.number} · {item.client.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.issueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatCurrency(item.amount, item.currency)}</span>
                  <StatusBadge value={item.status} tone={item.status === "PAID" || item.status === "ACCEPTED" ? "success" : item.status === "OVERDUE" ? "error" : "warning"} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <UsageCard usage={mockUsage} paid={mockUser.plan === "PAID"} />
      </section>
    </div>
  );
}
