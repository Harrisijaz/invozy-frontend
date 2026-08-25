"use client";

import Link from "next/link";
import { ArrowRightLeft, Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { canEditQuotation, quotationStatusLabels } from "@/src/lib/customer/status";
import { mockQuotations } from "@/src/mocks/customer/data";

export function QuotationList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockQuotations.filter((quotation) => (!query || quotation.number.toLowerCase().includes(query) || quotation.client.name.toLowerCase().includes(query)) && (status === "ALL" || quotation.status === status));
  }, [search, status]);
  return (
    <Card className="min-w-0">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search quotation or client" />
        <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          {Object.entries(quotationStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Button asChild href="/app/quotations/new">Create Quotation</Button>
      </div>
      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="py-3 pr-3">Quotation #</th><th className="px-3 py-3">Client</th><th className="px-3 py-3">Issue Date</th><th className="px-3 py-3">Valid Until</th><th className="px-3 py-3 text-right">Amount</th><th className="px-3 py-3">Status</th><th className="py-3 pl-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((quotation) => (
              <tr key={quotation.id} className="border-b border-border last:border-0">
                <td className="py-4 pr-3 font-medium"><Link href={`/app/quotations/${quotation.id}`}>{quotation.number}</Link></td>
                <td className="px-3 py-4">{quotation.client.name}</td>
                <td className="px-3 py-4 text-muted-foreground">{formatDate(quotation.issueDate)}</td>
                <td className="px-3 py-4 text-muted-foreground">{formatDate(quotation.validUntil)}</td>
                <td className="px-3 py-4 text-right font-medium">{formatCurrency(quotation.amount, quotation.currency)}</td>
                <td className="px-3 py-4"><StatusBadge value={quotationStatusLabels[quotation.status]} tone={quotation.status === "ACCEPTED" ? "success" : quotation.status === "EXPIRED" ? "error" : "warning"} /></td>
                <td className="py-4 pl-3"><div className="flex justify-end gap-1"><Button asChild href={`/app/quotations/${quotation.id}`} variant="ghost" size="sm">View</Button>{canEditQuotation(quotation.status) ? <Button asChild href={`/app/quotations/${quotation.id}/edit`} variant="ghost" size="icon"><Edit3 className="h-4 w-4" /></Button> : null}<Button variant="ghost" size="icon" title="Convert"><ArrowRightLeft className="h-4 w-4" /></Button>{canEditQuotation(quotation.status) ? <Button variant="ghost" size="icon" title="Delete"><Trash2 className="h-4 w-4 text-error" /></Button> : null}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 grid gap-3 md:hidden">
        {filtered.map((quotation) => (
          <Link key={quotation.id} href={`/app/quotations/${quotation.id}`} className="rounded-lg border border-border p-4 transition hover:bg-muted">
            <div className="flex justify-between gap-3"><div className="min-w-0"><p className="font-medium">{quotation.number}</p><p className="mt-1 truncate text-sm text-muted-foreground">{quotation.client.name}</p></div><MoreHorizontal className="h-5 w-5 text-muted-foreground" /></div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-lg font-semibold">{formatCurrency(quotation.amount, quotation.currency)}</span><StatusBadge value={quotationStatusLabels[quotation.status]} tone={quotation.status === "ACCEPTED" ? "success" : quotation.status === "EXPIRED" ? "error" : "warning"} /></div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
