"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { openPaddleCheckout } from "@/src/lib/customer/paddle";

export default function BillingCheckoutPage() {
  return (
    <Suspense fallback={<BillingCheckoutLoading />}>
      <BillingCheckoutContent />
    </Suspense>
  );
}

function BillingCheckoutLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-sm text-muted-foreground">
      <Card className="flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Opening payment checkout...</span>
      </Card>
    </main>
  );
}

function BillingCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("_ptxn") ?? "";
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const error = transactionId ? checkoutError : "Checkout transaction is missing.";

  useEffect(() => {
    if (!transactionId) return;

    let active = true;

    async function openCheckout() {
      try {
        await openPaddleCheckout(transactionId);
      } catch (checkoutError) {
        if (active) {
          setCheckoutError(checkoutError instanceof Error ? checkoutError.message : "Unable to open Paddle checkout.");
        }
      }
    }

    void openCheckout();

    return () => {
      active = false;
    };
  }, [transactionId]);

  if (error) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto grid w-full max-w-3xl gap-6">
          <PageHeader title="Checkout Unavailable" description={error} />
          <Card className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => router.refresh()}>Retry</Button>
            <Button asChild href="/app/subscription">View Subscription</Button>
          </Card>
        </div>
      </main>
    );
  }

  return <BillingCheckoutLoading />;
}
