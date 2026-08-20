"use client";

import { ArrowDownUp, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button, EmptyState, ErrorState, Input, LoadingState } from "./ui";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

function readValue<T extends object>(row: T, key: keyof T | string) {
  return (row as Record<string, unknown>)[String(key)];
}

export function DataTable<T extends object>({ data, columns, searchKeys, loading, error, actions, emptyTitle = "No records found" }: { data: T[]; columns: Column<T>[]; searchKeys: (keyof T)[]; loading?: boolean; error?: boolean; actions?: ReactNode; emptyTitle?: string }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    const rows = data.filter((row) => searchKeys.some((key) => String(readValue(row, key) ?? "").toLowerCase().includes(lower)));
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => String(readValue(a, sortKey) ?? "").localeCompare(String(readValue(b, sortKey) ?? "")));
  }, [data, query, searchKeys, sortKey]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <LoadingState label="Loading table" />;
  if (error) return <ErrorState />;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search records" aria-label="Search records" />
        </label>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {paginated.length === 0 ? (
        <div className="p-4"><EmptyState title={emptyTitle} description="Try changing your filters or search query." /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)} className="px-4 py-3 font-semibold">
                    {column.sortable ? (
                      <button className="inline-flex items-center gap-2" onClick={() => setSortKey(String(column.key))}>
                        {column.header}<ArrowDownUp className="h-3.5 w-3.5" />
                      </button>
                    ) : column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, index) => (
                <tr key={String(readValue(row, "id") ?? index)} className="border-t border-border transition hover:bg-muted/50">
                  {columns.map((column) => <td key={String(column.key)} className="px-4 py-3 align-middle text-foreground">{column.render ? column.render(row) : String(readValue(row, column.key) ?? "")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-border p-3 text-sm text-muted-foreground">
        <span>Page {page} of {pages}</span>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
          <Button variant="secondary" disabled={page === pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>Next</Button>
        </div>
      </div>
    </div>
  );
}
