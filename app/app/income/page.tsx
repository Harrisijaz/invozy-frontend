import { FeatureGate } from "@/components/shared/feature-gate";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { IncomeExpenseChart } from "@/components/financial/financial-charts";
import { getEntitlements } from "@/src/lib/customer/entitlements";
import { formatCurrency } from "@/src/lib/customer/formatters";
import { mockExpenses, mockInvoices, mockUsage, mockUser } from "@/src/mocks/customer/data";

export default function IncomePage() {
  const entitlements = getEntitlements(mockUser.plan, mockUsage);
  const income = mockInvoices.filter((invoice) => invoice.status === "PAID").reduce((sum, invoice) => sum + invoice.amount, 0);
  const expenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (
    <div className="grid gap-6">
      <PageHeader title="Income" description="Income is calculated from paid invoices, not manually entered revenue." />
      <FeatureGate allowed={entitlements.canViewIncome} title="Unlock income dashboard" description="Income trends and savings analysis are available with Invozy Paid.">
        <div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm text-muted-foreground">Total Income</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(income)}</p></Card><Card><p className="text-sm text-muted-foreground">Expenses</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(expenses)}</p></Card><Card><p className="text-sm text-muted-foreground">Savings</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(income - expenses)}</p></Card></div>
        <IncomeExpenseChart />
      </FeatureGate>
    </div>
  );
}
