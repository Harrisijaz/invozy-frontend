import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  FileText,
  HelpCircle,
  Mail,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WalletCards,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Button } from "@/components/ui/button";

const stats = [
  ["Invoices", "Create, send, and track"],
  ["Quotes", "Convert accepted work"],
  ["Expenses", "Record spending clearly"],
  ["Reports", "Understand cash flow"],
] as const;

const capabilities = [
  { icon: FileText, title: "Professional invoices", body: "Create polished invoices with line items, taxes, discounts, due dates, notes, and PDF-ready formatting." },
  { icon: ReceiptText, title: "Quotations that convert", body: "Send clear quotes, track acceptance, and move approved work into invoice workflows without duplicate typing." },
  { icon: WalletCards, title: "Expense control", body: "Capture business spending, categorize records, and keep income and expenses visible from the same workspace." },
  { icon: Bot, title: "AI-assisted drafting", body: "Turn plain work descriptions into invoice drafts, then review every number before saving or sending." },
  { icon: BarChart3, title: "Financial reporting", body: "Monitor paid, unpaid, overdue, income, expense, and savings signals from responsive dashboard views." },
  { icon: ShieldCheck, title: "Secure account access", body: "Login-protected customer panels keep personal settings, business details, and documents separated by account." },
] as const;

const workflow = [
  { step: "01", title: "Sign up or log in", body: "Start with a customer account so invoices, quotes, expenses, and settings stay connected to your workspace." },
  { step: "02", title: "Create documents", body: "Add client details, services, taxes, payment notes, and business branding from a clean document builder." },
  { step: "03", title: "Track the result", body: "Follow document status, business income, spending, and subscription usage from the side user panel." },
] as const;

const faqs = [
  { question: "Can I use Invozy from the customer panel?", answer: "Yes. After login, the customer panel includes dashboard, invoices, quotations, expenses, financial reports, subscription, and settings routes." },
  { question: "Do I need an account to get started?", answer: "The landing page sends new users to signup and returning users to login, so saved business data stays tied to a secure workspace." },
  { question: "Is the page responsive on mobile?", answer: "Yes. The hero, navigation, feature cards, pricing preview, and FAQ sections stack vertically on small screens and expand on desktop." },
  { question: "Where do the main buttons go?", answer: "Get Started routes to /signup, Login routes to /login, and Open Workspace routes to /app/dashboard for authenticated customers." },
] as const;

const contactMethods = [
  { icon: Mail, title: "Email support", body: "Send product questions, billing issues, or onboarding requests.", value: "support@invozy.com" },
  { icon: MessageSquareText, title: "Customer help", body: "Get guidance for invoices, quotes, expenses, and workspace setup.", value: "Reply within 24 hours" },
  { icon: TimerReset, title: "Response window", body: "Priority issues are reviewed first during business hours.", value: "Mon-Fri support" },
] as const;

export default function Home() {
  return (
    <MarketingShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div className="min-w-0">
            <div className="group inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
              <BadgeCheck className="h-4 w-4 shrink-0 text-primary transition duration-200 group-hover:scale-110 group-hover:rotate-6" />
              <span className="truncate">Professional invoicing workspace for modern businesses</span>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Invoice, quote, and manage business finances from one calm workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Invozy gives customers a focused side panel for invoices, quotations, expenses, reports, billing, and profile settings. Start quickly, keep records organized, and move from document creation to payment tracking with less friction.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Button asChild href="/signup" size="lg" className="group w-full sm:w-auto">
                Get Started <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button asChild href="/login" variant="secondary" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
              <Button asChild href="/app/dashboard" variant="outline" size="lg" className="w-full sm:w-auto">
                Open Workspace
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["PDF-ready documents", "AI draft support", "Responsive customer panel"].map((item) => (
                <div key={item} className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary transition duration-200 group-hover:scale-110" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="group overflow-hidden rounded-lg border border-border bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl">
              <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <Image src="/brand/invozy-logo-new.png" alt="Invozy" width={112} height={36} className="h-8 w-auto object-contain transition duration-300 group-hover:scale-105 dark:hidden" priority />
                  <Image src="/brand/invozy-logo-dark-v2.png" alt="Invozy" width={112} height={36} className="hidden h-8 w-auto object-contain transition duration-300 group-hover:scale-105 dark:block" priority />
                  <span className="hidden text-sm font-medium text-muted-foreground sm:inline">Customer workspace</span>
                </div>
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Live panel</span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30">
                    <p className="text-sm text-muted-foreground">Total income</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">$24,680</p>
                    <p className="mt-2 text-sm text-success">+18% this month</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30">
                    <p className="text-sm text-muted-foreground">Pending invoices</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">$6,420</p>
                    <p className="mt-2 text-sm text-warning">4 awaiting payment</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-border bg-card">
                  {[
                    ["INV-1024", "Brand identity", "$2,400", "Paid"],
                    ["QUO-318", "Website refresh", "$5,800", "Accepted"],
                    ["EXP-088", "Software tools", "$340", "Recorded"],
                  ].map(([code, title, amount, status]) => (
                    <div key={code} className="grid gap-2 border-b border-border px-4 py-3 text-sm transition duration-200 last:border-b-0 hover:bg-muted/45 sm:grid-cols-[90px_1fr_auto_auto] sm:items-center">
                      <span className="font-medium text-foreground">{code}</span>
                      <span className="text-muted-foreground">{title}</span>
                      <span className="font-medium text-foreground">{amount}</span>
                      <span className="w-fit rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
              <p className="text-lg font-semibold text-foreground">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-primary">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Everything the customer panel needs.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Built for daily business document work, not just a single invoice screen.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item) => (
              <article key={item.title} className="group rounded-lg border border-border bg-background p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
                <item.icon className="h-5 w-5 text-primary transition duration-200 group-hover:scale-110 group-hover:-rotate-3" />
                <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">From signup to paid invoice in a clear path.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">The homepage routes people into the right place: signup for new users, login for existing users, and the dashboard for authenticated customer work.</p>
          </div>
          <div className="grid gap-4">
            {workflow.map((item) => (
              <article key={item.step} className="group grid gap-4 rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md sm:grid-cols-[64px_1fr]">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary transition duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">{item.step}</div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Start free, upgrade when your workflow grows.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Give new customers a simple entry point while keeping the route to paid plans visible.</p>
            <Button asChild href="/pricing" className="group mt-6">
              View Pricing <ChevronRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-lg border border-border bg-background p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
              <p className="text-sm font-medium text-muted-foreground">Free</p>
              <h3 className="mt-2 text-3xl font-semibold text-foreground">$0</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Create invoices and explore the customer workspace basics.</p>
            </article>
            <article className="rounded-lg border border-primary bg-background p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-medium text-primary">Paid</p>
              <h3 className="mt-2 text-3xl font-semibold text-foreground">$15<span className="text-base font-normal text-muted-foreground">/month</span></h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Unlock higher limits, saved workflows, and stronger business controls.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Contact us</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Need help setting up your workspace?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Reach out for billing, onboarding, product questions, or help choosing the right workflow for invoices, quotations, and expenses.
            </p>
            <div className="mt-6 grid gap-3">
              {contactMethods.map((item) => (
                <article key={item.title} className="group rounded-lg border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="h-5 w-5 transition duration-200 group-hover:scale-110" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                      <p className="mt-2 break-words text-sm font-semibold text-primary">{item.value}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="border-b border-border pb-5">
              <h3 className="text-xl font-semibold text-foreground">Send a message</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Tell us what you need and the team will follow up with the right next step.</p>
            </div>
            <form className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  Full name
                  <input className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" placeholder="Your name" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  Email address
                  <input type="email" className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" placeholder="you@company.com" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Topic
                <select className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" defaultValue="">
                  <option value="" disabled>Select a topic</option>
                  <option>Account setup</option>
                  <option>Billing and subscription</option>
                  <option>Invoices and quotations</option>
                  <option>Technical support</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Message
                <textarea className="min-h-32 resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" placeholder="Write your message..." />
              </label>
              <div className="grid gap-3 border-t border-border pt-5 sm:flex sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">For active customers, include your account email.</p>
                <Button type="button" className="group w-full sm:w-auto">
                  Submit Message <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="faqs" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
          <div>
            <div className="group inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-primary transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary hover:text-primary-foreground">
              <HelpCircle className="h-5 w-5 transition duration-200 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Quick answers about routing, account access, and the customer landing flow.</p>
          </div>
          <div className="grid gap-3">
            {faqs.map((item) => (
              <details key={item.question} className="group rounded-lg border border-border bg-card p-5 transition duration-200 hover:border-primary/35 hover:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground">
                  {item.question}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Ready to begin</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Create your Invozy workspace today.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Signup takes new users into account creation. Login brings existing customers back to their panel.</p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap lg:justify-end">
            <Button asChild href="/signup" size="lg" className="group w-full sm:w-auto">
              Get Started <Sparkles className="h-4 w-4 transition duration-200 group-hover:scale-110 group-hover:rotate-6" />
            </Button>
            <Button asChild href="/login" variant="secondary" size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
