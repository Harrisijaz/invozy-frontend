import { api } from "@/lib/api";
import type { Payment, Refund } from "@/types";
import { payments, refunds } from "@/mocks/payments";

const delay = <T,>(data: T) => new Promise<T>((resolve) => setTimeout(() => resolve(data), 240));

export const billingService = {
  async getPayments() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<Payment[]>("/admin/billing/payments");
      return data;
    }
    return delay(payments);
  },
  async getRefunds() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<Refund[]>("/admin/billing/refunds");
      return data;
    }
    return delay(refunds);
  },
  async requestRefund(transactionId: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") await api.post(`/admin/billing/${transactionId}/refund`);
    return delay({ ok: true, status: "Refund Requested" as const });
  },
};
