import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = { title: "About", description: "About Invozy." };

export default function AboutPage() {
  return <MarketingShell><section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8"><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built for clear financial work.</h1><p className="mt-5 text-base leading-8 text-muted-foreground">Invozy is a SaaS product for customers who need professional invoicing, quotation workflows, expense tracking, subscription-aware usage, and financial insight without the clutter of a generic admin dashboard.</p></section></MarketingShell>;
}
