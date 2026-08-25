import { Download, Link2, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { calculateDocumentTotals } from "@/src/lib/customer/totals";
import { canDeleteInvoice, canEditInvoice, canEditQuotation, invoiceStatusLabels, quotationStatusLabels } from "@/src/lib/customer/status";
import { mockBusiness, mockInvoices, mockQuotations, mockUser } from "@/src/mocks/customer/data";

export function DocumentDetail({ id, type }: { id: string; type: "invoice" | "quotation" }) {
  const doc = type === "invoice" ? mockInvoices.find((item) => item.id === id) : mockQuotations.find((item) => item.id === id);
  if (!doc) {
    return <Card>Document not found.</Card>;
  }
  const totals = calculateDocumentTotals(doc.items);
  const editable = type === "invoice" ? canEditInvoice(doc.status as never) : canEditQuotation(doc.status as never);
  const deletable = type === "invoice" ? canDeleteInvoice(doc.status as never) : canEditQuotation(doc.status as never);
  const statusLabel = type === "invoice" ? invoiceStatusLabels[doc.status as keyof typeof invoiceStatusLabels] : quotationStatusLabels[doc.status as keyof typeof quotationStatusLabels];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="min-w-0 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-border bg-background p-4 sm:p-8">
          <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{mockBusiness.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{mockBusiness.address}<br />{mockBusiness.email}</p>
            </div>
            <div className="sm:text-right">
              <h1 className="text-2xl font-semibold">{doc.number}</h1>
              <div className="mt-3"><StatusBadge value={statusLabel} tone={doc.status === "PAID" || doc.status === "ACCEPTED" ? "success" : doc.status === "OVERDUE" || doc.status === "EXPIRED" ? "error" : "warning"} /></div>
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
            {editable ? <Button asChild href={`/app/${type === "invoice" ? "invoices" : "quotations"}/${doc.id}/edit`} variant="secondary"><Pencil className="h-4 w-4" />Edit</Button> : <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">{type === "invoice" ? "Paid invoices cannot be edited." : "Converted or expired quotations cannot be edited."}</p>}
            <Button variant="secondary"><Download className="h-4 w-4" />Download PDF</Button>
            {type === "invoice" ? <Button variant="secondary" disabled={mockUser.plan === "FREE"}><Link2 className="h-4 w-4" />Payment Link</Button> : <Button variant="secondary">Convert to Invoice</Button>}
            {deletable ? <Button variant="danger"><Trash2 className="h-4 w-4" />Delete</Button> : null}
          </div>
        </Card>
        {type === "invoice" && mockUser.plan === "FREE" ? <Card><p className="text-sm font-medium">Payment links are available on the Paid plan.</p><Button asChild href="/app/subscription" className="mt-3 w-full">Upgrade to Paid</Button></Card> : null}
      </aside>
    </div>
  );
}
