import type { InvoiceStatus, QuotationStatus } from "@/src/types/customer";

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  UNPAID: "Unpaid",
  PAID: "Paid",
  OVERDUE: "Overdue",
  DELETED: "Deleted",
};

export const quotationStatusLabels: Record<QuotationStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  EXPIRED: "Expired",
  CONVERTED: "Converted",
};

export function canEditInvoice(status: InvoiceStatus) {
  return status === "DRAFT" || status === "UNPAID";
}

export function canDeleteInvoice(status: InvoiceStatus) {
  return status === "DRAFT" || status === "UNPAID";
}

export function canEditQuotation(status: QuotationStatus) {
  return status !== "CONVERTED" && status !== "EXPIRED";
}
