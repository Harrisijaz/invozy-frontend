"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className={cn("grid rounded-lg border border-border bg-muted p-1", compact ? "grid-cols-3" : "grid-cols-3")}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;
        return (
          <button key={option.value} title={option.label} aria-label={`Use ${option.label} theme`} onClick={() => setTheme(option.value)} className={cn("inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition", active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <Icon className="h-3.5 w-3.5" />
            {compact ? <span className="sr-only">{option.label}</span> : <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
