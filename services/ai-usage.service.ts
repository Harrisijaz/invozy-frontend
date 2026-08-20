import { api } from "@/lib/api";
import type { AIUsage, AIUsageSummary, MetricPoint } from "@/types";
import { aiCosts, aiRequests, aiUsage, aiUsageSummary } from "@/mocks/ai-usage";

export const aiUsageService = {
  async getAIUsage() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<{ summary: AIUsageSummary; usage: AIUsage[]; requests: MetricPoint[]; costs: MetricPoint[] }>("/admin/ai-usage");
      return data;
    }
    return new Promise<{ summary: AIUsageSummary; usage: AIUsage[]; requests: MetricPoint[]; costs: MetricPoint[] }>((resolve) =>
      setTimeout(() => resolve({ summary: aiUsageSummary, usage: aiUsage, requests: aiRequests, costs: aiCosts }), 260),
    );
  },
};
