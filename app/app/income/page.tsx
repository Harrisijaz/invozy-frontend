"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { financialService } from "@/src/services/customer/financial.service";
import { formatCurrency } from "@/src/lib/customer/formatters";
import { centsToAmount } from "@/src/lib/customer/normalize";

export default function IncomePage() {
  const summary = useQuery({ queryKey: ["customer", "finance-summary"], queryFn: () => financialService.summary() });
  return (
    <div className="grid gap-6">
      <PageHeader title="Income" description="Income, expenses, and savings are calculated by the backend finance summary API." />
      {summary.isLoading ? <Card>Loading income summary...</Card> : null}
      {summary.isError ? <Card>Unable to load income summary from the gateway.</Card> : null}
      {summary.data ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card><p className="text-sm text-muted-foreground">Total Income</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.incomeCents))}</p></Card>
          <Card><p className="text-sm text-muted-foreground">Expenses</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.expensesCents))}</p></Card>
          <Card><p className="text-sm text-muted-foreground">Savings</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.savingsCents))}</p></Card>
        </div>
      ) : null}
    </div>
  );
}
