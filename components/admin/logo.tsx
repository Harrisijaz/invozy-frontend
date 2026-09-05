"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function InvoRightsLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? "/brand/invorights-logo-dark.png" : "/brand/invorights-logo.png";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image src={logoSrc} alt="InvoRights" width={compact ? 44 : 221} height={compact ? 44 : 48} className={compact ? "h-11 w-11 object-cover object-left" : "h-12 w-auto object-contain"} priority />
      {compact ? <span className="text-xl font-semibold tracking-tight text-foreground">InvoRights</span> : null}
    </div>
  );
}
