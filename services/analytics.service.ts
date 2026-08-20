import { api } from "@/lib/api";
import type { AnalyticsSummary } from "@/types";
import { analytics } from "@/mocks/analytics";

export const analyticsService = {
  async getAnalytics() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<AnalyticsSummary>("/admin/analytics");
      return data;
    }
    return new Promise<AnalyticsSummary>((resolve) => setTimeout(() => resolve(analytics), 260));
  },
};
