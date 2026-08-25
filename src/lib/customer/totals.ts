import type { LineItem } from "@/src/types/customer";

export function calculateLineTotal(item: LineItem) {
  return item.quantity * item.unitPrice;
}

export function calculateDocumentTotals(items: LineItem[]) {
  const subtotal = items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const taxAmount = items.reduce((sum, item) => sum + calculateLineTotal(item) * (item.taxRate / 100), 0);
  return {
    subtotal,
    taxAmount,
    grandTotal: subtotal + taxAmount,
  };
}
