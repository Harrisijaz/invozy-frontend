import Image from "next/image";
import { cn } from "@/lib/utils";

export function InvozyLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image src="/brand/invozy-logo.png" alt="Invozy" width={compact ? 36 : 132} height={compact ? 36 : 42} className={compact ? "h-9 w-9 object-cover object-left" : "h-10 w-auto object-contain"} priority />
      {compact ? <span className="text-lg font-semibold tracking-tight text-foreground">Invozy</span> : null}
    </div>
  );
}
