"use client";

import Link from "next/link";
import { Copy, Download, Edit3, Link2, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useToast } from "@/components/common/toast";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { getPaymentLinkErrorMessage } from "@/src/lib/customer/api";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { normalizeLocalPaymentLinkUrl } from "@/src/lib/customer/payment-links";
import { canDeleteInvoice, canEditInvoice, invoiceStatusLabels } from "@/src/lib/customer/status";
import { useDeleteInvoice, useInvoicePaymentLink, useInvoices } from "@/src/hooks/customer/useInvoices";
import { pdfService } from "@/src/services/customer/pdf.service";
import type { Invoice, InvoiceStatus } from "@/src/types/customer";

export function InvoiceList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [generatedPaymentLinks, setGeneratedPaymentLinks] = useState<Record<string, string>>({});
  const invoices = useInvoices({ status: status as InvoiceStatus | "ALL", clientName: search || undefined });
  const deleteInvoice = useDeleteInvoice();
  const paymentLink = useInvoicePaymentLink();
  const toast = useToast();
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (invoices.data?.items ?? []).filter((invoice) => {
      const matchesQuery = !query || invoice.number.toLowerCase().includes(query) || invoice.client.name.toLowerCase().includes(query);
      const matchesStatus = status === "ALL" || invoice.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [invoices.data?.items, search, status]);

  if (invoices.isLoading) return <Card>Loading invoices...</Card>;
  if (invoices.isError) return <Card>Unable to load invoices.</Card>;

  const copyPaymentLink = async (url: string) => {
    await navigator.clipboard.writeText(normalizeLocalPaymentLinkUrl(url));
    toast("Payment link copied.", "success");
  };

  const sendPaymentLink = (invoice: Invoice) => {
    paymentLink.mutate(invoice.id, {
      onSuccess: ({ url }) => {
        setGeneratedPaymentLinks((current) => ({ ...current, [invoice.id]: url }));
        void copyPaymentLink(url).catch(() => toast("Payment link generated. Use Copy Link to copy it.", "warning"));
      },
      onError: (error) => toast(getPaymentLinkErrorMessage(error), "error"),
    });
  };

  const isGeneratingPaymentLink = (invoiceId: string) => paymentLink.isPending && paymentLink.variables === invoiceId;

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
              <tr key={invoice.id} className="border-b border-border transition duration-200 last:border-0 hover:bg-muted/45">
                <td className="py-4 pr-3 font-medium"><Link href={`/app/invoices/${invoice.id}`} className="hover:text-primary">{invoice.number}</Link></td>
                <td className="px-3 py-4"><p>{invoice.client.name}</p>{invoice.client.phone ? <p className="text-xs text-muted-foreground">{invoice.client.phone}</p> : null}</td>
                <td className="px-3 py-4 text-muted-foreground">{formatDate(invoice.issueDate)}</td>
                <td className="px-3 py-4 text-muted-foreground">{formatDate(invoice.dueDate)}</td>
                <td className="px-3 py-4 text-right font-medium">{formatCurrency(invoice.amount, invoice.currency)}</td>
                <td className="px-3 py-4"><StatusBadge value={invoiceStatusLabels[invoice.status]} tone={invoice.status === "PAID" ? "success" : invoice.status === "DELETED" ? "error" : "warning"} /></td>
                <td className="py-4 pl-3">
                  <div className="flex justify-end gap-1">
                    <Button asChild href={`/app/invoices/${invoice.id}`} variant="ghost" size="sm">View</Button>
                    {canEditInvoice(invoice.status) ? <Button asChild href={`/app/invoices/${invoice.id}/edit`} variant="ghost" size="icon"><Edit3 className="h-4 w-4" /></Button> : null}
                    <Button variant="ghost" size="icon" title="Download PDF" onClick={() => void pdfService.downloadInvoice(invoice.id)}><Download className="h-4 w-4" /></Button>
                    {(() => {
                      const invoicePaymentLink = generatedPaymentLinks[invoice.id] ?? invoice.activePaymentLink ?? null;
                      const usableInvoicePaymentLink = invoicePaymentLink ? normalizeLocalPaymentLinkUrl(invoicePaymentLink) : null;
                      if (invoice.status === "UNPAID" && !invoicePaymentLink) return <Button variant="ghost" size="sm" title="Generate Payment Link" isLoading={isGeneratingPaymentLink(invoice.id)} onClick={() => sendPaymentLink(invoice)}><Link2 className="h-4 w-4" />Pay Link</Button>;
                      if (invoice.status !== "PAID" && usableInvoicePaymentLink) return <Button variant="ghost" size="sm" title="Copy Payment Link" onClick={() => void copyPaymentLink(usableInvoicePaymentLink).catch(() => toast("Unable to copy payment link.", "error"))}><Copy className="h-4 w-4" />Copy Link</Button>;
                      return null;
                    })()}
                    {canDeleteInvoice(invoice.status) ? <Button variant="ghost" size="icon" title="Delete" onClick={() => deleteInvoice.mutate(invoice.id)}><Trash2 className="h-4 w-4 text-error" /></Button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 grid gap-3 md:hidden">
        {filtered.map((invoice) => (
          <div key={invoice.id} className="rounded-lg border border-border p-4 transition duration-200 hover:border-primary/35 hover:bg-muted/60 hover:shadow-sm">
            {(() => {
              const invoicePaymentLink = generatedPaymentLinks[invoice.id] ?? invoice.activePaymentLink ?? null;
              const usableInvoicePaymentLink = invoicePaymentLink ? normalizeLocalPaymentLinkUrl(invoicePaymentLink) : null;
              return (
                <>
            <Link href={`/app/invoices/${invoice.id}`} className="block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{invoice.number}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{invoice.client.name}</p>
                  {invoice.client.phone ? <p className="mt-1 truncate text-xs text-muted-foreground">{invoice.client.phone}</p> : null}
                </div>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-lg font-semibold">{formatCurrency(invoice.amount, invoice.currency)}</span>
                <StatusBadge value={invoiceStatusLabels[invoice.status]} tone={invoice.status === "PAID" ? "success" : invoice.status === "DELETED" ? "error" : "warning"} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
            </Link>
            {invoice.status === "UNPAID" && !invoicePaymentLink ? <Button className="mt-4 w-full" variant="secondary" isLoading={isGeneratingPaymentLink(invoice.id)} onClick={() => sendPaymentLink(invoice)}><Link2 className="h-4 w-4" />Generate Payment Link</Button> : null}
            {invoice.status !== "PAID" && usableInvoicePaymentLink ? <Button className="mt-4 w-full" variant="secondary" onClick={() => void copyPaymentLink(usableInvoicePaymentLink).catch(() => toast("Unable to copy payment link.", "error"))}><Copy className="h-4 w-4" />Copy Payment Link</Button> : null}
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </Card>
  );
}
