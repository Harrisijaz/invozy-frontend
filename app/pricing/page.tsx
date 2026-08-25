import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Pricing", description: "Compare Invozy Free and Paid plans." };

const rows = [
  ["Invoices", "5 lifetime", "Unlimited"],
  ["AI generations", "2 lifetime", "Unlimited"],
  ["Quotations", "Unlimited", "Unlimited"],
  ["Tax/GST", "Included", "Included"],
  ["PDF export", "Included", "Included"],
  ["Online payment links", "Not included", "Included"],
  ["Expenses", "10/month", "Unlimited"],
  ["Income dashboard", "Not included", "Included"],
  ["Financial reports", "Not included", "Included"],
] as const;

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple plans for modern businesses.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Start free, then upgrade to remove limits and unlock payments, income dashboards, and reports.</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card><h2 className="text-xl font-semibold">Free</h2><p className="mt-2 text-sm text-muted-foreground">For trying core billing workflows.</p><p className="mt-6 text-3xl font-semibold">$0</p><Button asChild href="/signup" className="mt-6 w-full" variant="secondary">Start Free</Button></Card>
          <Card className="border-primary/40"><h2 className="text-xl font-semibold">Paid</h2><p className="mt-2 text-sm text-muted-foreground">For running billing and financial workflows without limits.</p><p className="mt-6 text-3xl font-semibold">$12<span className="text-base font-normal text-muted-foreground">/month</span></p><Button asChild href="/signup" className="mt-6 w-full">Upgrade to Paid</Button></Card>
        </div>
        <Card className="mt-8 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50"><tr><th className="p-4">Feature</th><th className="p-4">Free</th><th className="p-4">Paid</th></tr></thead>
              <tbody>{rows.map(([feature, free, paid]) => <tr key={feature} className="border-b border-border last:border-0"><td className="p-4 font-medium">{feature}</td><td className="p-4 text-muted-foreground">{free === "Not included" ? <span className="inline-flex items-center gap-2"><XCircle className="h-4 w-4 text-error" />{free}</span> : free}</td><td className="p-4"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />{paid}</span></td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </section>
    </MarketingShell>
  );
}
