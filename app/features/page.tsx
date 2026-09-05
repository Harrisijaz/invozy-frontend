import type { Metadata } from "next";
import { BarChart3, Bot, CreditCard, FileText, ReceiptText, ShieldCheck, Wallet } from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Features", description: "Explore InvoRights invoice, quotation, expense, payment, and financial reporting features." };

const features = [
  ["Invoice Management", FileText, "Create, edit, filter, download PDFs, mark paid, and manage invoice lifecycle rules."],
  ["AI Invoice Generation", Bot, "Generate drafts from prompts with mandatory review and no invented pricing."],
  ["Quotation Management", ReceiptText, "Build quotations and convert accepted work into invoices."],
  ["Online Payment", CreditCard, "Paid-plan payment links connect through backend payment infrastructure."],
  ["Expense Tracking", Wallet, "Track categorized expenses with Free monthly usage limits."],
  ["Financial Reports", BarChart3, "Unlock monthly, yearly, PDF, and CSV reports on Paid."],
  ["Tax/GST", ShieldCheck, "Configure default tax and reuse it across invoices and quotations."],
] as const;

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything customers need to manage billing.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">InvoRights keeps invoices, quotations, expenses, income, subscription usage, and reporting in a clear SaaS workspace.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, Icon, body]) => <Card key={title}><Icon className="h-5 w-5 text-primary" /><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></Card>)}
        </div>
      </section>
    </MarketingShell>
  );
}
