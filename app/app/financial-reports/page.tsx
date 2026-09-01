"use client";

import { useQuery } from "@tanstack/react-query";
import { FinancialBreakdownChart, FinancialSummaryChart } from "@/components/financial/financial-charts";
import { FeatureGate } from "@/components/shared/feature-gate";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { useSubscription } from "@/src/hooks/customer/useSubscription";
import { financialService } from "@/src/services/customer/financial.service";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { getStoredUserInfo } from "@/lib/auth";
import { centsToAmount } from "@/src/lib/customer/normalize";
import { isActivePaidSubscription } from "@/src/lib/customer/plans";

export default function FinancialReportsPage() {
  const userId = getStoredUserInfo()?.userId ?? "anonymous";
  const subscription = useSubscription();
  const subscriptionActive = subscription.isSuccess && isActivePaidSubscription(subscription.data.subscription);
  const summary = useQuery({
    queryKey: ["customer", "finance-summary", userId],
    queryFn: () => financialService.summary(),
    enabled: subscriptionActive,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  return (
    <div className="grid gap-6">
      <PageHeader title="Financial Reports" description="Income, expenses, and savings are loaded from GET /finance/summary." />
      {subscription.isLoading ? <Card>Checking subscription...</Card> : null}
      {!subscription.isLoading && !subscriptionActive ? (
        <FeatureGate allowed={false} title="Financial reports require an active subscription" description="Activate your subscription to view income graphs and financial reporting charts.">
          <FinancialSummaryChart summary={{ fromDate: "", toDate: "", incomeCents: 0, expensesCents: 0, savingsCents: 0 }} />
        </FeatureGate>
      ) : null}
      {summary.isLoading ? <Card>Loading finance summary...</Card> : null}
      {summary.isError ? <Card>Unable to load finance summary from the gateway.</Card> : null}
      {subscriptionActive && summary.data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><p className="text-sm text-muted-foreground">Income</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.incomeCents))}</p></Card>
            <Card><p className="text-sm text-muted-foreground">Expenses</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.expensesCents))}</p></Card>
            <Card><p className="text-sm text-muted-foreground">Savings</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.savingsCents))}</p></Card>
            <Card className="md:col-span-3"><p className="text-sm text-muted-foreground">Period</p><p className="mt-2 font-medium">{formatDate(summary.data.fromDate)} - {formatDate(summary.data.toDate)}</p></Card>
          </div>
          <FinancialSummaryChart summary={summary.data} />
          <FinancialBreakdownChart summary={summary.data} />
        </>
      ) : null}
    </div>
  );
}
