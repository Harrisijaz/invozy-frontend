"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

export default function PreferencesPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Preferences" description="Theme preference is persisted and can follow the system setting." />
      <Card>
        <h2 className="font-semibold">Theme</h2>
        <p className="mt-2 text-sm text-muted-foreground">Choose light, dark, or system preference.</p>
        <div className="mt-4"><ThemeToggle /></div>
      </Card>
    </div>
  );
}
