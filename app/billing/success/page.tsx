"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, CreditCard, FileText, Loader2, Sparkles } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PlanBadge, StatusBadge } from "@/components/shared/status-badge";
import { UsageProgress } from "@/components/shared/usage-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserToken } from "@/lib/auth";
import { useSubscription } from "@/src/hooks/customer/useSubscription";
import { formatDate } from "@/src/lib/customer/formatters";
import { isActivePaidSubscription } from "@/src/lib/customer/plans";

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<SubscriptionLoading />}>
      <BillingSuccessContent />
    </Suspense>
  );
}

function SubscriptionLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-sm text-muted-foreground">
      <Card className="flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Refreshing subscription...</span>
      </Card>
    </main>
  );
}

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscription = useSubscription();
  const transactionId = searchParams.get("_ptxn");
  const current = subscription.data?.subscription;
  const paid = isActivePaidSubscription(current);
  const [polling, setPolling] = useState(false);
  const [pollingComplete, setPollingComplete] = useState(false);

  useEffect(() => {
    if (!getUserToken()) {
      router.replace(`/login?next=${encodeURIComponent("/billing/success")}`);
    }
  }, [router]);

  useEffect(() => {
    if (!current || paid || pollingComplete) return;

    let active = true;
    const pollForPaid = async () => {
      await Promise.resolve();
      if (!active) return;
      setPolling(true);

      for (let attempt = 0; attempt < 12; attempt += 1) {
        if (!active) return;
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2500));
        }
        const result = await subscription.refetch();
        if (isActivePaidSubscription(result.data?.subscription)) {
          if (active) {
            setPolling(false);
            setPollingComplete(true);
          }
          return;
        }
      }
      if (active) {
        setPolling(false);
        setPollingComplete(true);
      }
    };

    void pollForPaid();

    return () => {
      active = false;
    };
  }, [current, paid, pollingComplete, subscription]);

  if (!getUserToken()) {
    return <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Redirecting to login...</main>;
  }

  if (subscription.isLoading || polling) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-sm text-muted-foreground">
        <Card className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Payment processing...</span>
        </Card>
      </main>
    );
  }

  if (subscription.isError || !subscription.data) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto grid w-full max-w-4xl gap-6">
          <PageHeader title="Billing Status" description="Checkout finished, but the subscription state could not be loaded from the gateway." />
          <Card>
            <p className="text-sm text-muted-foreground">Please open the subscription page to retry the status check.</p>
            <Button asChild href="/app/subscription" className="mt-4">View Subscription</Button>
          </Card>
        </div>
      </main>
    );
  }

  if (!paid && pollingComplete) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto grid w-full max-w-4xl gap-6">
          <PageHeader title="Payment Processing" description="Checkout finished. Your paid plan will activate after Paddle sends the payment webhook." />
          <Card className="grid gap-4">
            {transactionId ? <p className="text-sm text-muted-foreground">Transaction: <span className="font-medium text-foreground">{transactionId}</span></p> : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => void subscription.refetch()}>Refresh Status</Button>
              <Button asChild href="/app/subscription">View Subscription</Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const resolvedSubscription = subscription.data.subscription;
  const resolvedPaid = isActivePaidSubscription(resolvedSubscription);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <PageHeader
          title={resolvedPaid ? "Subscription Activated" : "Subscription Updated"}
          description="Your latest billing status has been refreshed from the subscription gateway."
          actions={<Button asChild href="/app/dashboard">Go to Dashboard</Button>}
        />
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-primary/5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{resolvedPaid ? "Pro plan is active" : "Current plan refreshed"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Subscription status: {resolvedSubscription.status}</p>
                  {transactionId ? <p className="mt-1 text-xs text-muted-foreground">Transaction: {transactionId}</p> : null}
                </div>
              </div>
              <PlanBadge plan={resolvedSubscription.planType} />
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><CreditCard className="h-4 w-4" />Billing</div>
              <p className="mt-3 text-lg font-semibold">{resolvedSubscription.renewalDate ? formatDate(resolvedSubscription.renewalDate) : "No renewal date"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{resolvedSubscription.downgradeScheduled ? "Downgrade scheduled" : "No downgrade scheduled"}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><FileText className="h-4 w-4" />Invoices</div>
              <p className="mt-3 text-lg font-semibold">{resolvedSubscription.lifetimeInvoiceCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Free limit: {resolvedSubscription.freeInvoiceLimit}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="h-4 w-4" />AI Generations</div>
              <p className="mt-3 text-lg font-semibold">{resolvedSubscription.lifetimeAiGenerationCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Free limit: {resolvedSubscription.freeAiLimit}</p>
            </div>
          </div>
        </Card>
        <Card className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Usage After Payment</h2>
            <StatusBadge value={resolvedSubscription.status} tone={resolvedPaid ? "success" : "warning"} />
          </div>
          <UsageProgress label="Invoices" used={resolvedSubscription.lifetimeInvoiceCount} limit={resolvedPaid ? null : resolvedSubscription.freeInvoiceLimit} scope="lifetime" />
          <UsageProgress label="AI" used={resolvedSubscription.lifetimeAiGenerationCount} limit={resolvedPaid ? null : resolvedSubscription.freeAiLimit} scope="lifetime" />
        </Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button asChild href="/app/subscription" variant="secondary">View Subscription</Button>
          <Button asChild href="/app/invoices/new">Create Invoice</Button>
        </div>
      </div>
    </main>
  );
}
