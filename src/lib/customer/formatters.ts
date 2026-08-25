import { format } from "date-fns";

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatDate(value: string | Date) {
  return format(new Date(value), "MMM d, yyyy");
}

export function formatDateTime(value: string | Date) {
  return format(new Date(value), "MMM d, yyyy h:mm a");
}
