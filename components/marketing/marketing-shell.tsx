import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  ["Features", "/#features"],
  ["Workflow", "/#workflow"],
  ["Pricing", "/#pricing"],
  ["Contact", "/#contact"],
  ["FAQs", "/#faqs"],
] as const;

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <BrandLogo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="inline-block transition duration-200 hover:-translate-y-0.5 hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Button asChild href="/login" variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            <Button asChild href="/signup">Get Started</Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <BrandLogo compact />
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/login" className="inline-block transition duration-200 hover:-translate-y-0.5 hover:text-foreground">Login</Link>
            <Link href="/signup" className="inline-block transition duration-200 hover:-translate-y-0.5 hover:text-foreground">Signup</Link>
            <Link href="/pricing" className="inline-block transition duration-200 hover:-translate-y-0.5 hover:text-foreground">Pricing</Link>
            <Link href="/#contact" className="inline-block transition duration-200 hover:-translate-y-0.5 hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
