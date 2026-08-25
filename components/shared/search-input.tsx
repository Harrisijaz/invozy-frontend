"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/form";

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative min-w-0">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9 pr-10" />
      {value ? (
        <button type="button" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted" onClick={() => onChange("")} aria-label="Clear search">
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
