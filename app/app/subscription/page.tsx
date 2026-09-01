"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Crown, Sparkles, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PlanBadge } from "@/components/shared/status-badge";
import { UsageCard } from "@/components/shared/usage-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCancelSubscription, useCreateCheckout, useSubscription } from "@/src/hooks/customer/useSubscription";
import { formatDate } from "@/src/lib/customer/formatters";
import { isActivePaidSubscription } from "@/src/lib/customer/plans";

export default function SubscriptionPage() {
  const subscription = useSubscription();
  const checkout = useCreateCheckout();
  const cancel = useCancelSubscription();
  if (subscription.isLoading) return <Card>Loading subscription...</Card>;
  if (subscription.isError || !subscription.data) return <Card>Unable to load subscription from the gateway.</Card>;
  const current = subscription.data.subscription;
  const isPaid = isActivePaidSubscription(current);
  const statusText = [
    `Status: ${current.status}`,
    current.renewalDate ? `Renewal: ${formatDate(current.renewalDate)}` : null,
    current.downgradeScheduled ? "Downgrade scheduled" : null,
  ].filter(Boolean).join(" - ");
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Start with the essentials for testing your invoice workflow.",
      icon: Sparkles,
      active: !isPaid,
      tone: "neutral",
      features: [
        `${current.freeInvoiceLimit} lifetime invoices`,
        `${current.freeAiLimit} lifetime AI generations`,
        "10 expenses per month",
        "Invoice and quotation builder",
        "Basic financial overview",
      ],
    },
    {
      name: "Pro",
      price: "$15",
      period: "per month",
      description: "Unlock the full workspace for regular billing and finance tracking.",
      icon: Crown,
      active: isPaid,
      tone: "primary",
      features: [
        "Unlimited invoices",
        "Unlimited AI generations",
        "Payment links",
        "Unlimited expenses",
        "Income dashboard",
        "Professional income graphs",
        "Financial reports with charts",
      ],
    },
  ] as const;

  return (
    <div className="grid gap-6">
      <PageHeader title="Subscription" description="Choose the plan that fits your billing workflow and track usage against your current limits." />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="min-w-0"
              >
                <Card className={`relative flex h-full flex-col overflow-hidden p-0 ${plan.active ? "border-primary/45 shadow-md shadow-primary/10" : ""}`}>
                  {plan.active ? <div className="absolute inset-x-0 top-0 h-1 bg-primary" /> : null}
                  <div className="grid gap-5 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-11 w-11 place-items-center rounded-lg ${plan.tone === "primary" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">{plan.name}</h2>
                          <p className="text-sm text-muted-foreground">{plan.active ? "Current plan" : "Available plan"}</p>
                        </div>
                      </div>
                      {plan.active ? <PlanBadge plan={current.planType} /> : null}
                    </div>
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                        <span className="pb-1 text-sm text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="grid gap-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto border-t border-border bg-muted/25 p-5 sm:p-6">
                    {plan.name === "Pro" && !isPaid ? (
                      <Button onClick={() => checkout.mutate()} isLoading={checkout.isPending} className="w-full"><Zap className="h-4 w-4" />Upgrade to Paid</Button>
                    ) : null}
                    {plan.name === "Pro" && isPaid ? (
                      <Button variant="danger" onClick={() => cancel.mutate()} isLoading={cancel.isPending} className="w-full">Cancel Subscription</Button>
                    ) : null}
                    {plan.name === "Free" ? (
                      <Button variant="secondary" disabled className="w-full">{plan.active ? "Active Plan" : "Included by default"}</Button>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <UsageCard usage={subscription.data.usage} paid={isPaid} />
      </motion.section>
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Billing Status</p>
          <p className="mt-1 text-sm text-muted-foreground">{statusText}</p>
        </div>
        <PlanBadge plan={current.planType} />
      </Card>
    </div>
  );
}
