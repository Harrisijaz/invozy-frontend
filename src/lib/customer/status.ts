import type { InvoiceStatus, QuotationStatus } from "@/src/types/customer";

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  UNPAID: "Unpaid",
  PAYMENT_PROCESSING: "Payment Processing",
  PAID: "Paid",
  DELETED: "Deleted",
};

export const quotationStatusLabels: Record<QuotationStatus, string> = {
  PENDING: "Pending",
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
