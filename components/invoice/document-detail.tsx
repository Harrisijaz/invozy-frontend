"use client";

import { Download, Link2, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { calculateDocumentTotals } from "@/src/lib/customer/totals";
import { canDeleteInvoice, canEditInvoice, invoiceStatusLabels, quotationStatusLabels } from "@/src/lib/customer/status";
import { useDeleteInvoice, useInvoice, useInvoicePaymentLink, useMarkInvoicePaid, usePublishInvoice } from "@/src/hooks/customer/useInvoices";
import { useConvertQuotation, useQuotation } from "@/src/hooks/customer/useQuotations";
import { useSubscription } from "@/src/hooks/customer/useSubscription";
import { useSettings } from "@/src/hooks/customer/useSettings";
import { pdfService } from "@/src/services/customer/pdf.service";

export function DocumentDetail({ id, type }: { id: string; type: "invoice" | "quotation" }) {
  const invoice = useInvoice(id, type === "invoice");
  const quotation = useQuotation(id, type === "quotation");
  const settings = useSettings();
  const subscription = useSubscription();
  const deleteInvoice = useDeleteInvoice();
  const markPaid = useMarkInvoicePaid();
  const publishInvoice = usePublishInvoice();
  const paymentLink = useInvoicePaymentLink();
  const convertQuotation = useConvertQuotation();
  const query = type === "invoice" ? invoice : quotation;
  const doc = query.data;
  const business = {
    name: settings.data?.businessName ?? "Smart Invoice",
    email: "",
    address: "",
  };
  if (query.isLoading) return <Card>Loading document...</Card>;
  if (query.isError) return <Card>Unable to load document.</Card>;
  if (!doc) {
    return <Card>Document not found.</Card>;
  }
  const totals = calculateDocumentTotals(doc.items);
  const editable = type === "invoice" && canEditInvoice(doc.status as never);
  const deletable = type === "invoice" && canDeleteInvoice(doc.status as never);
  const statusLabel = type === "invoice" ? invoiceStatusLabels[doc.status as keyof typeof invoiceStatusLabels] : quotationStatusLabels[doc.status as keyof typeof quotationStatusLabels];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="min-w-0 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-border bg-background p-4 sm:p-8">
          <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{business.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{business.address}<br />{business.email}</p>
            </div>
            <div className="sm:text-right">
              <h1 className="text-2xl font-semibold">{doc.number}</h1>
              <div className="mt-3"><StatusBadge value={statusLabel} tone={doc.status === "PAID" || doc.status === "CONVERTED" ? "success" : doc.status === "DELETED" || doc.status === "EXPIRED" ? "error" : "warning"} /></div>
            </div>
          </div>
          <div className="grid gap-6 border-b border-border py-6 md:grid-cols-2">
            <div><p className="text-sm text-muted-foreground">Bill to</p><p className="mt-2 font-semibold">{doc.client.name}</p><p className="text-sm leading-6 text-muted-foreground">{doc.client.email}<br />{doc.client.address}</p></div>
            <div className="grid gap-2 text-sm md:justify-end md:text-right">
              <p><span className="text-muted-foreground">Issue Date:</span> {formatDate(doc.issueDate)}</p>
              <p><span className="text-muted-foreground">{type === "invoice" ? "Due Date" : "Valid Until"}:</span> {formatDate(type === "invoice" ? "dueDate" in doc ? doc.dueDate : doc.issueDate : "validUntil" in doc ? doc.validUntil : doc.issueDate)}</p>
            </div>
          </div>
          <div className="overflow-x-auto py-6">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-border text-muted-foreground"><tr><th className="py-3 pr-3">Description</th><th className="px-3 py-3 text-right">Qty</th><th className="px-3 py-3 text-right">Unit Price</th><th className="px-3 py-3 text-right">Tax</th><th className="py-3 pl-3 text-right">Total</th></tr></thead>
              <tbody>{doc.items.map((item) => <tr key={item.id} className="border-b border-border last:border-0"><td className="py-3 pr-3">{item.description}</td><td className="px-3 py-3 text-right">{item.quantity}</td><td className="px-3 py-3 text-right">{formatCurrency(item.unitPrice, doc.currency)}</td><td className="px-3 py-3 text-right">{item.taxRate}%</td><td className="py-3 pl-3 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice, doc.currency)}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="ml-auto grid max-w-sm gap-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal, doc.currency)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(totals.taxAmount, doc.currency)}</span></div>
            <div className="flex justify-between text-lg font-semibold"><span>Grand Total</span><span>{formatCurrency(totals.grandTotal, doc.currency)}</span></div>
          </div>
          {doc.notes ? <p className="mt-8 rounded-lg bg-muted p-4 text-sm leading-6 text-muted-foreground">{doc.notes}</p> : null}
        </div>
      </Card>
      <aside className="grid gap-3 self-start">
        <Card>
          <h2 className="font-semibold">Actions</h2>
          <div className="mt-4 grid gap-2">
            {editable ? <Button asChild href={`/app/invoices/${doc.id}/edit`} variant="secondary"><Pencil className="h-4 w-4" />Edit</Button> : type === "invoice" ? <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Paid invoices cannot be edited.</p> : null}
            <Button variant="secondary" onClick={() => void (type === "invoice" ? pdfService.downloadInvoice(doc.id) : pdfService.downloadQuotation(doc.id))}><Download className="h-4 w-4" />Download PDF</Button>
            {type === "invoice" ? <Button variant="secondary" onClick={() => paymentLink.mutate(doc.id)} disabled={subscription.data?.plan === "FREE"}><Link2 className="h-4 w-4" />Payment Link</Button> : <Button variant="secondary" onClick={() => convertQuotation.mutate(doc.id)}>Convert to Invoice</Button>}
            {type === "invoice" && doc.status === "DRAFT" ? <Button variant="secondary" onClick={() => publishInvoice.mutate(doc.id)}>Publish Invoice</Button> : null}
            {type === "invoice" && doc.status !== "PAID" ? <Button variant="secondary" onClick={() => markPaid.mutate(doc.id)}>Mark Paid</Button> : null}
            {deletable && type === "invoice" ? <Button variant="danger" onClick={() => deleteInvoice.mutate(doc.id)}><Trash2 className="h-4 w-4" />Delete</Button> : null}
          </div>
        </Card>
        {type === "invoice" && subscription.data?.plan === "FREE" ? <Card><p className="text-sm font-medium">Payment links are available on the Paid plan.</p><Button asChild href="/app/subscription" className="mt-3 w-full">Upgrade to Paid</Button></Card> : null}
      </aside>
    </div>
  );
}
