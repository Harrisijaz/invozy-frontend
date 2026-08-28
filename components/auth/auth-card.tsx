import { BrandLogo } from "@/components/brand/brand-logo";

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.95fr_1fr]">
      <section className="hidden border-r border-border bg-card px-10 py-12 lg:flex lg:flex-col lg:gap-28 xl:px-14">
        <BrandLogo />
        <div className="max-w-xl">
          <p className="text-sm font-medium text-primary">Invozy customer panel</p>
          <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-tight">Manage invoices, expenses, and business finances from one place.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">A clean workspace for creating documents, reviewing AI drafts, tracking usage, and understanding financial progress.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><BrandLogo /></div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
