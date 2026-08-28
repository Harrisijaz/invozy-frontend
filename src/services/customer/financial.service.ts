import { customerApi } from "@/src/lib/customer/api";
import type { FinanceSummary } from "@/src/types/customer";

export const financialService = {
  async summary(params?: { fromDate?: string; toDate?: string }) {
    const response = await customerApi.get<FinanceSummary>("/finance/summary", { params });
    return response.data;
  },
  async dashboard() {
    return this.summary();
  },
  async reports(params?: { fromDate?: string; toDate?: string }) {
    return this.summary(params);
  },
};
