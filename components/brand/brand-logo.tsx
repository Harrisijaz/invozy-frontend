import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({ href = "/", compact = false, className }: { href?: string; compact?: boolean; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 text-foreground", className)} aria-label="Invozy home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <ReceiptText className="h-5 w-5" />
      </span>
      {!compact ? <span className="text-lg font-semibold tracking-tight">Invozy</span> : null}
    </Link>
  );
}
