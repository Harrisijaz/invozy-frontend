"use client";

import { useQuery } from "@tanstack/react-query";
import { FinancialSummaryChart } from "@/components/financial/financial-charts";
import { FeatureGate } from "@/components/shared/feature-gate";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { useSubscription } from "@/src/hooks/customer/useSubscription";
import { financialService } from "@/src/services/customer/financial.service";
import { formatCurrency } from "@/src/lib/customer/formatters";
import { getStoredUserInfo } from "@/lib/auth";
import { centsToAmount } from "@/src/lib/customer/normalize";
import { isActivePaidSubscription } from "@/src/lib/customer/plans";

export default function IncomePage() {
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
      <PageHeader title="Income" description="Income, expenses, and savings are calculated by the backend finance summary API." />
      {subscription.isLoading ? <Card>Checking subscription...</Card> : null}
      {!subscription.isLoading && !subscriptionActive ? (
        <FeatureGate allowed={false} title="Income graph requires an active subscription" description="Activate your subscription to view professional income and finance charts.">
          <FinancialSummaryChart summary={{ fromDate: "", toDate: "", incomeCents: 0, expensesCents: 0, savingsCents: 0 }} />
        </FeatureGate>
      ) : null}
      {summary.isLoading ? <Card>Loading income summary...</Card> : null}
      {summary.isError ? <Card>Unable to load income summary from the gateway.</Card> : null}
      {subscriptionActive && summary.data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><p className="text-sm text-muted-foreground">Total Income</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.incomeCents))}</p></Card>
            <Card><p className="text-sm text-muted-foreground">Expenses</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.expensesCents))}</p></Card>
            <Card><p className="text-sm text-muted-foreground">Savings</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(centsToAmount(summary.data.savingsCents))}</p></Card>
          </div>
          <FinancialSummaryChart summary={summary.data} title="Income Overview" />
        </>
      ) : null}
    </div>
  );
}
