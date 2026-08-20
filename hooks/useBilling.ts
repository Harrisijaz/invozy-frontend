"use client";

export { useFailedPendingPayments as usePayments, useRefundPayment as useRequestRefund } from "@/hooks/admin/useBilling";

export function useRefunds() {
  return { data: [], isLoading: false };
}
