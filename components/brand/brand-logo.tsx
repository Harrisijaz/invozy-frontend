"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function BrandLogo({ href = "/", compact = false, className }: { href?: string; compact?: boolean; className?: string }) {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? "/brand/invozy-logo-dark-v2.png" : "/brand/invozy-logo-new.png";

  return (
    <Link href={href} className={cn("inline-flex items-center gap-3 text-foreground", className)} aria-label="Invozy home">
      <Image
        src={logoSrc}
        alt="Invozy"
        width={compact ? 44 : 166}
        height={compact ? 44 : 54}
        className={compact ? "h-11 w-11 object-cover object-left" : "h-12 w-auto object-contain"}
        priority
      />
      {compact ? <span className="text-xl font-semibold tracking-tight text-foreground">Invozy</span> : null}
    </Link>
  );
}
