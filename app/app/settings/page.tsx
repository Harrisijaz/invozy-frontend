import Link from "next/link";
import { Building2, Percent, SlidersHorizontal, UserRound } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const settings = [
  { title: "Profile", href: "/app/settings/profile", icon: UserRound, body: "Name, email, avatar, and password." },
  { title: "Business", href: "/app/settings/business", icon: Building2, body: "Business details reused in invoices, quotations, and PDFs." },
  { title: "Tax", href: "/app/settings/tax", icon: Percent, body: "Default tax rate for new documents." },
  { title: "Preferences", href: "/app/settings/preferences", icon: SlidersHorizontal, body: "Theme and notification preferences." },
] as const;

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Settings" description="Manage account, business, tax, and workspace preferences." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {settings.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition hover:border-primary/40 hover:bg-muted/50">
              <item.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
