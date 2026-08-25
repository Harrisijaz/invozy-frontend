"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1">
      {themes.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn(
            "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-2.5 text-sm text-muted-foreground transition hover:text-foreground",
            theme === item.value && "bg-muted text-foreground",
            compact && "h-9 w-9 px-0",
          )}
          onClick={() => setTheme(item.value)}
          aria-label={`Use ${item.label} theme`}
          title={item.label}
        >
          <item.icon className="h-4 w-4" />
          {!compact ? <span className="hidden sm:inline">{item.label}</span> : null}
        </button>
      ))}
    </div>
  );
}
