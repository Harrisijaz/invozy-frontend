import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FeatureGate({ allowed, title, description, children }: { allowed: boolean; title: string; description: string; children: React.ReactNode }) {
  if (allowed) return <>{children}</>;
  return (
    <Card className="flex min-h-72 flex-col items-center justify-center text-center">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
        <Lock className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <Button asChild href="/app/subscription" className="mt-5">Upgrade to Paid</Button>
    </Card>
  );
}
