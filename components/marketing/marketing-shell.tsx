import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

const links = [
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <BrandLogo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild href="/login" variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            <Button asChild href="/signup">Get Started</Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
