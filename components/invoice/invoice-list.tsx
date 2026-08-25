"use client";

import Link from "next/link";
import { Download, Edit3, Link2, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { mockInvoices } from "@/src/mocks/customer/data";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { canDeleteInvoice, canEditInvoice, invoiceStatusLabels } from "@/src/lib/customer/status";

export function InvoiceList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockInvoices.filter((invoice) => {
      const matchesQuery = !query || invoice.number.toLowerCase().includes(query) || invoice.client.name.toLowerCase().includes(query);
      const matchesStatus = status === "ALL" || invoice.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [search, status]);

  return (
    <Card className="min-w-0">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search invoice or client" />
        <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          {Object.entries(invoiceStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Button asChild href="/app/invoices/new">Create Invoice</Button>
      </div>
      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-3 pr-3">Invoice #</th>
              <th className="px-3 py-3">Client</th>
              <th className="px-3 py-3">Issue Date</th>
              <th className="px-3 py-3">Due Date</th>
              <th className="px-3 py-3 text-right">Amount</th>
              <th className="px-3 py-3">Status</th>
              <th className="py-3 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border last:border-0">
                <td className="py-4 pr-3 font-medium"><Link href={`/app/invoices/${invoice.id}`} className="hover:text-primary">{invoice.number}</Link></td>
                <td className="px-3 py-4">{invoice.client.name}</td>
                <td className="px-3 py-4 text-muted-foreground">{formatDate(invoice.issueDate)}</td>
                <td className="px-3 py-4 text-muted-foreground">{formatDate(invoice.dueDate)}</td>
                <td className="px-3 py-4 text-right font-medium">{formatCurrency(invoice.amount, invoice.currency)}</td>
                <td className="px-3 py-4"><StatusBadge value={invoiceStatusLabels[invoice.status]} tone={invoice.status === "PAID" ? "success" : invoice.status === "OVERDUE" ? "error" : "warning"} /></td>
                <td className="py-4 pl-3">
                  <div className="flex justify-end gap-1">
                    <Button asChild href={`/app/invoices/${invoice.id}`} variant="ghost" size="sm">View</Button>
                    {canEditInvoice(invoice.status) ? <Button asChild href={`/app/invoices/${invoice.id}/edit`} variant="ghost" size="icon"><Edit3 className="h-4 w-4" /></Button> : null}
                    <Button variant="ghost" size="icon" title="Download PDF"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Payment link"><Link2 className="h-4 w-4" /></Button>
                    {canDeleteInvoice(invoice.status) ? <Button variant="ghost" size="icon" title="Delete"><Trash2 className="h-4 w-4 text-error" /></Button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 grid gap-3 md:hidden">
        {filtered.map((invoice) => (
          <Link key={invoice.id} href={`/app/invoices/${invoice.id}`} className="rounded-lg border border-border p-4 transition hover:bg-muted">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{invoice.number}</p>
                <p className="mt-1 truncate text-sm text-muted-foreground">{invoice.client.name}</p>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-lg font-semibold">{formatCurrency(invoice.amount, invoice.currency)}</span>
              <StatusBadge value={invoiceStatusLabels[invoice.status]} tone={invoice.status === "PAID" ? "success" : invoice.status === "OVERDUE" ? "error" : "warning"} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
