import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PlanBadge } from "@/components/shared/status-badge";
import { UsageCard } from "@/components/shared/usage-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockUsage, mockUser } from "@/src/mocks/customer/data";

export default function SubscriptionPage() {
  const benefits = ["Unlimited invoices", "Unlimited AI generations", "Payment links", "Unlimited expenses", "Income dashboard", "Financial reports"];
  return (
    <div className="grid gap-6">
      <PageHeader title="Subscription" description="Backend billing and Paddle checkout integration points are isolated in subscription.service.ts." />
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">Current Plan</p><h2 className="mt-1 text-2xl font-semibold">{mockUser.plan === "PAID" ? "Paid" : "Free"}</h2></div><PlanBadge plan={mockUser.plan} /></div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Free includes 5 lifetime invoices, 2 lifetime AI generations, unlimited quotations, tax/GST, PDF export, and 10 expenses/month.</p>
          <Button className="mt-5">Upgrade to Paid</Button>
        </Card>
        <UsageCard usage={mockUsage} paid={mockUser.plan === "PAID"} />
      </div>
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div><h2 className="text-xl font-semibold">$12/month</h2><p className="mt-2 text-sm text-muted-foreground">Paid processing is handled by backend/Paddle. No frontend payment simulation is implemented.</p></div>
          <Button>Upgrade to Paid</Button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{benefits.map((benefit) => <div key={benefit} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" />{benefit}</div>)}</div>
      </Card>
    </div>
  );
}
