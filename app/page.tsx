import { ArrowRight, BadgeCheck, Bot, FileText, ReceiptText, WalletCards } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Button } from "@/components/ui/button";

const capabilities = [
  { icon: FileText, title: "Create polished invoices", body: "Manual builders, reusable line items, tax support, PDFs, and clear payment states." },
  { icon: Bot, title: "Draft invoices with AI", body: "Describe the work, review every detail, and save only when the numbers are complete." },
  { icon: ReceiptText, title: "Manage quotations", body: "Send quotations, track acceptance, and convert accepted work into invoices." },
  { icon: WalletCards, title: "Know your numbers", body: "Track expenses, income, savings, usage, and reports from one focused workspace." },
];

export default function Home() {
  return (
    <MarketingShell>
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Light-first financial SaaS for growing teams
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Invoicing made simple.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Invozy helps customers create invoices and quotations, generate AI-assisted drafts, track expenses, and understand business finances from one polished application.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild href="/signup" size="lg">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild href="/pricing" variant="secondary" size="lg">
              View Pricing
            </Button>
          </div>
        </div>
        <div className="min-w-0 rounded-[1.25rem] border border-border bg-card p-3 shadow-sm">
          <div className="rounded-2xl border border-border bg-background p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding invoices</p>
                <p className="mt-1 text-3xl font-semibold">$12,840</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Paid plan</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Paid", "Unpaid", "Draft"].map((label, index) => (
                <div key={label} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{[24, 8, 3][index]}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              {["INV-1007  Northstar Studio  $2,400  Paid", "INV-1008  Atlas Legal  $1,150  Unpaid", "QUO-2041  Finch Labs  $6,800  Accepted"].map((row) => (
                <div key={row} className="grid grid-cols-1 gap-2 border-b border-border px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_auto]">
                  <span className="truncate text-foreground">{row}</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-card/60">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {capabilities.map((item) => (
            <article key={item.title} className="rounded-lg border border-border bg-card p-5">
              <item.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
