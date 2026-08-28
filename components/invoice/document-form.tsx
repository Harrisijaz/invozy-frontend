"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/common/toast";
import { FeatureGate } from "@/components/shared/feature-gate";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { calculateDocumentTotals } from "@/src/lib/customer/totals";
import { formatCurrency } from "@/src/lib/customer/formatters";
import { getEntitlements } from "@/src/lib/customer/entitlements";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { invoiceToRequest, quotationToRequest } from "@/src/lib/customer/normalize";
import { useCreateInvoice, useUpdateInvoice } from "@/src/hooks/customer/useInvoices";
import { useSubscription } from "@/src/hooks/customer/useSubscription";
import { useCreateQuotation } from "@/src/hooks/customer/useQuotations";
import { useSettings } from "@/src/hooks/customer/useSettings";

const schema = z.object({
  clientName: z.string().min(2, "Client name is required."),
  clientEmail: z.email("Enter a valid email."),
  documentNumber: z.string().min(2, "Document number is required."),
  issueDate: z.string().min(1, "Issue date is required."),
  dueDate: z.string().min(1, "Due date is required."),
  currency: z.string().min(3, "Currency is required."),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(2, "Description is required."),
    quantity: z.number().positive("Quantity must be positive."),
    unitPrice: z.number().nonnegative("Price cannot be negative."),
    taxRate: z.number().min(0).max(100),
  })).min(1),
});

type FormValues = z.infer<typeof schema>;

export function DocumentForm({ type = "invoice", id }: { type?: "invoice" | "quotation"; id?: string }) {
  const router = useRouter();
  const toast = useToast();
  const subscription = useSubscription();
  const settings = useSettings();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const createQuotation = useCreateQuotation();
  const plan = subscription.data?.plan ?? "FREE";
  const usage = subscription.data?.usage ?? { invoicesUsedLifetime: 0, aiUsedLifetime: 0, expensesUsedThisMonth: 0 };
  const business = {
    name: settings.data?.businessName ?? "Smart Invoice",
    currency: settings.data?.baseCurrency ?? "USD",
    defaultTaxRate: settings.data?.defaultTaxRate ?? 0,
  };
  const entitlements = getEntitlements(plan, usage);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      documentNumber: type === "invoice" ? "INV-1005" : "QUO-2043",
      issueDate: "",
      dueDate: "",
      currency: business.currency,
      notes: "",
      items: [{ description: "", quantity: 1, unitPrice: 0, taxRate: business.defaultTaxRate }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const formValues = useWatch({ control: form.control });
  const watchedItems = (formValues.items ?? []).map((item, index) => ({
    id: fields[index]?.id ?? String(index),
    description: item?.description ?? "",
    quantity: item?.quantity ?? 0,
    unitPrice: item?.unitPrice ?? 0,
    taxRate: item?.taxRate ?? 0,
  }));
  const currency = formValues.currency ?? business.currency;
  const clientName = formValues.clientName ?? "";
  const clientEmail = formValues.clientEmail ?? "";
  const documentNumber = formValues.documentNumber ?? "";
  const totals = calculateDocumentTotals(watchedItems);
  const submit = form.handleSubmit(async (values) => {
    try {
      if (type === "invoice") {
        const payload = invoiceToRequest(values);
        const saved = id ? await updateInvoice.mutateAsync({ id, payload }) : await createInvoice.mutateAsync(payload);
        toast(id ? "Invoice updated." : "Invoice created.", "success");
        router.push(`/app/invoices/${saved.id}`);
        return;
      }
      if (id) {
        toast("Quotation updates are not available.", "error");
        return;
      }
      const payload = quotationToRequest(values);
      const saved = await createQuotation.mutateAsync(payload);
      toast("Quotation created.", "success");
      router.push(`/app/quotations/${saved.id}`);
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  });

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <form className="grid gap-4" onSubmit={submit}>
        {type === "invoice" ? (
          <FeatureGate allowed={entitlements.canUseAI} title="AI invoice generation is limited" description="You've reached your free AI generation limit. Upgrade to Paid for unlimited AI drafts.">
            <Card className="border-primary/25 bg-primary/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /><h2 className="font-semibold">Generate with AI</h2></div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Describe the invoice. Missing price, quantity, tax, total, or currency must be provided before saving.</p>
                </div>
                <Button type="button" variant="secondary">Open AI Draft</Button>
              </div>
            </Card>
          </FeatureGate>
        ) : null}
        <Card className="grid gap-4">
          <h2 className="font-semibold">Client Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Client Name" error={form.formState.errors.clientName?.message}><Input {...form.register("clientName")} /></Field>
            <Field label="Client Email" error={form.formState.errors.clientEmail?.message}><Input type="email" {...form.register("clientEmail")} /></Field>
          </div>
        </Card>
        <Card className="grid gap-4">
          <h2 className="font-semibold">{type === "invoice" ? "Invoice" : "Quotation"} Details</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Number" error={form.formState.errors.documentNumber?.message}><Input {...form.register("documentNumber")} /></Field>
            <Field label="Issue Date" error={form.formState.errors.issueDate?.message}><Input type="date" {...form.register("issueDate")} /></Field>
            <Field label={type === "invoice" ? "Due Date" : "Valid Until"} error={form.formState.errors.dueDate?.message}><Input type="date" {...form.register("dueDate")} /></Field>
            <Field label="Currency" error={form.formState.errors.currency?.message}><Select {...form.register("currency")}><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option></Select></Field>
          </div>
        </Card>
        <Card className="grid gap-4 overflow-hidden">
          <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Line Items</h2><Button type="button" variant="secondary" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0, taxRate: business.defaultTaxRate })}><Plus className="h-4 w-4" />Add item</Button></div>
          <div className="grid gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3 lg:grid-cols-[1fr_100px_130px_100px_44px] lg:items-start">
                <Field label="Description" error={form.formState.errors.items?.[index]?.description?.message}>
                  <Input placeholder="Service or product name" {...form.register(`items.${index}.description`)} />
                </Field>
                <Field label="Quantity" error={form.formState.errors.items?.[index]?.quantity?.message}>
                  <Input type="number" min="0" step="0.01" placeholder="Qty" {...form.register(`items.${index}.quantity`, { valueAsNumber: true })} />
                </Field>
                <Field label="Unit Price" error={form.formState.errors.items?.[index]?.unitPrice?.message}>
                  <Input type="number" min="0" step="0.01" placeholder="Rate" {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
                </Field>
                <Field label="Tax Rate" error={form.formState.errors.items?.[index]?.taxRate?.message}>
                  <Input type="number" min="0" max="100" step="0.01" placeholder="Tax %" {...form.register(`items.${index}.taxRate`, { valueAsNumber: true })} />
                </Field>
                <Button type="button" variant="ghost" size="icon" className="lg:mt-7" onClick={() => remove(index)} aria-label="Remove item"><Trash2 className="h-4 w-4 text-error" /></Button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="grid gap-4">
          <Field label="Notes"><Textarea {...form.register("notes")} placeholder="Payment instructions or client-facing notes" /></Field>
        </Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary">Save Draft</Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>{id ? "Save Changes" : type === "invoice" ? "Create Invoice" : "Create Quotation"}</Button>
        </div>
      </form>
      <aside className="min-w-0 xl:sticky xl:top-20 xl:self-start">
        <Card className="bg-card">
          <div className="border-b border-border pb-5">
            <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">{business.name}</p><h2 className="mt-1 text-xl font-semibold">{documentNumber}</h2></div><StatusBadge value="Draft" tone="warning" /></div>
          </div>
          <div className="mt-5 grid gap-4 text-sm">
            <div><p className="text-muted-foreground">Bill to</p><p className="font-medium">{clientName || "Client name"}</p><p className="text-muted-foreground">{clientEmail || "client@example.com"}</p></div>
            <div className="overflow-hidden rounded-lg border border-border">
              {watchedItems.map((item, index) => <div key={`${item.id}-${index}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border p-3 last:border-b-0"><span className="truncate">{item.description || "Line item"}</span><span>{formatCurrency(item.quantity * item.unitPrice, currency)}</span></div>)}
            </div>
            <div className="grid gap-2 border-t border-border pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal, currency)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(totals.taxAmount, currency)}</span></div>
              <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatCurrency(totals.grandTotal, currency)}</span></div>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
