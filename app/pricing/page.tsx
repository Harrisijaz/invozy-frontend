import type { Metadata } from "next";
import { ArrowRight, BarChart3, CheckCircle2, Crown, FileText, LineChart, Sparkles, WalletCards, XCircle } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Pricing", description: "Compare InvoRights Free and Paid plans." };

const rows = [
  ["Invoices", "5 lifetime", "Unlimited"],
  ["AI generations", "2 lifetime", "Unlimited"],
  ["Quotations", "Unlimited", "Unlimited"],
  ["Tax/GST", "Included", "Included"],
  ["PDF export", "Included", "Included"],
  ["Online payment links", "Not included", "Included"],
  ["Expenses", "10/month", "Unlimited"],
  ["Income dashboard", "Not included", "Included"],
  ["Professional finance graphs", "Not included", "Included"],
  ["Financial reports with charts", "Not included", "Included"],
] as const;

const paidFeatures = [
  "Unlimited invoices, quotations, and expenses",
  "Invoice payment links for Paddle checkout",
  "Professional income graphs",
  "Financial reports with chart breakdowns",
  "Dashboard income updates after paid invoices",
] as const;

const graphBars = [
  ["Jan", 46, 18],
  ["Feb", 62, 24],
  ["Mar", 54, 22],
  ["Apr", 78, 31],
  ["May", 70, 27],
  ["Jun", 88, 35],
] as const;

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
              <Crown className="h-4 w-4 text-primary" />
              Paid plan unlocks finance graphs
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Simple pricing for invoices, payments, and finance reports.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Start free to create invoices. Upgrade when you need payment links, unlimited usage, income dashboards, and professional financial charts.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild href="/signup" size="lg" className="group w-full sm:w-auto">
                Start Free <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button asChild href="/signup" size="lg" variant="secondary" className="w-full sm:w-auto">Upgrade to Paid</Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Pro income graph preview</span>
              </div>
              <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Included in Paid</span>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Paid income", "$18.4k", "text-success"],
                  ["Expenses", "$4.2k", "text-accent"],
                  ["Savings", "$14.2k", "text-primary"],
                ].map(([label, value, tone]) => (
                  <div key={label} className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
                    <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>Income vs expenses</span>
                  <span>Last 6 months</span>
                </div>
                <div className="mt-4 flex h-60 items-end gap-3 border-b border-border px-2 pb-3">
                  {graphBars.map(([month, income, expense], index) => (
                    <div key={month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div className="flex h-48 items-end gap-1.5">
                        <span className="animate-graph-rise w-4 rounded-t-md bg-success" style={{ height: `${income}%`, animationDelay: `${index * 90}ms` }} />
                        <span className="animate-graph-rise w-4 rounded-t-md bg-accent" style={{ height: `${expense}%`, animationDelay: `${index * 90 + 80}ms` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-14 sm:px-6 lg:px-8">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[240px_1fr_auto] lg:items-center">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Free</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">For trying core billing workflows.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["5 lifetime invoices", "2 lifetime AI generations", "Basic finance overview"].map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="lg:min-w-48">
              <p className="text-4xl font-semibold">$0</p>
              <Button asChild href="/signup" className="mt-5 w-full" variant="secondary">Start Free</Button>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-primary/45 p-0 shadow-md shadow-primary/10">
          <div className="h-1 bg-primary" />
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[240px_1fr_auto] lg:items-center">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <Crown className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Paid</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">For running billing and financial workflows without limits.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {paidFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="lg:min-w-48">
              <p className="text-4xl font-semibold">$15<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <Button asChild href="/signup" className="mt-5 w-full">Upgrade to Paid</Button>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-5 grid gap-2">
          <h2 className="text-2xl font-semibold">Compare every feature</h2>
          <p className="text-sm leading-6 text-muted-foreground">Paid includes the graph and reporting tools needed to understand income after invoices are paid.</p>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50"><tr><th className="p-4">Feature</th><th className="p-4">Free</th><th className="p-4">Paid</th></tr></thead>
              <tbody>{rows.map(([feature, free, paid]) => <tr key={feature} className="border-b border-border last:border-0"><td className="p-4 font-medium">{feature}</td><td className="p-4 text-muted-foreground">{free === "Not included" ? <span className="inline-flex items-center gap-2"><XCircle className="h-4 w-4 text-error" />{free}</span> : free}</td><td className="p-4"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />{paid}</span></td></tr>)}</tbody>
            </table>
          </div>
        </Card>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            [FileText, "Create and publish invoices"],
            [WalletCards, "Collect invoice payments"],
            [BarChart3, "Unlock finance graphs"],
          ].map(([Icon, text]) => (
            <div key={String(text)} className="group rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
              <Icon className="h-5 w-5 text-primary transition duration-200 group-hover:scale-110" />
              <p className="mt-3 text-sm font-medium">{String(text)}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
