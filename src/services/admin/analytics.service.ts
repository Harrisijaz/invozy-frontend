import { api } from "@/lib/api";
import { asRecord, numberValue, pickArray, pickRecord, text, type UnknownRecord } from "@/lib/normalize";
import type { AdminDashboardParams, AdminDashboardView, AIUsageParams, AIUsageView, MetricPoint } from "@/types/admin/analytics";

function toMetricPoint(record: UnknownRecord, index: number): MetricPoint {
  return {
    label: text(record, ["label", "month", "date", "day", "name"], `Item ${index + 1}`),
    value: numberValue(record, ["value", "total", "amount", "count", "requests", "revenue"]),
    previous: numberValue(record, ["previous", "previousValue", "lastPeriod"], undefined as unknown as number),
  };
}

function metric(source: UnknownRecord, label: string, valueKeys: string[], changeKeys: string[] = []) {
  return {
    label,
    value: numberValue(source, valueKeys),
    change: numberValue(source, changeKeys, 0),
    comparison: "vs previous period",
  };
}

export const analyticsService = {
  async getDashboard(params?: AdminDashboardParams): Promise<AdminDashboardView> {
    const { data } = await api.get<unknown>("/admin/analytics/dashboard", { params });
    const root = asRecord(data);
    const summary = pickRecord(data, ["summary", "metrics", "dashboard"]);
    const revenue = pickArray(data, ["revenue", "monthlyRevenue", "revenueChart"]).map(toMetricPoint);
    const signups = pickArray(data, ["signups", "newSignups", "signupAnalytics"]).map(toMetricPoint);
    const churn = pickArray(data, ["churn", "churnAnalytics"]).map(toMetricPoint);

    return {
      totalUsers: metric(summary, "Total Users", ["totalUsers", "usersTotal", "users"]),
      freeUsers: metric(summary, "Free Users", ["freeUsers", "free"]),
      paidUsers: metric(summary, "Paid Users", ["paidUsers", "paid"]),
      monthlyRevenue: metric(summary, "Monthly Revenue", ["monthlyRevenue", "revenue", "currentMonthRevenue"], ["revenueGrowth", "monthlyRevenueChange"]),
      churnRate: numberValue(summary, ["churnRate"]),
      cancelledPaidSubscriptions: numberValue(summary, ["cancelledPaidSubscriptions", "cancelledSubscriptions"]),
      retainedUsers: numberValue(summary, ["retainedUsers"]),
      revenue: revenue.length ? revenue : pickArray(root.revenue, ["data"]).map(toMetricPoint),
      signups,
      churn,
      raw: data,
    };
  },

  async getAIUsage(params?: AIUsageParams): Promise<AIUsageView> {
    const { data } = await api.get<unknown>("/admin/analytics/ai-usage", { params });
    const summary = pickRecord(data, ["summary", "metrics"]);
    const rows = pickArray(data, ["usage", "users", "items", "data"]).map((record, index) => ({
      id: text(record, ["id", "userId"], `ai-${index}`),
      userId: text(record, ["userId", "id"]),
      user: text(record, ["user", "userName", "fullName", "email"], "Unknown user"),
      plan: text(record, ["plan", "subscriptionPlan"], "UNKNOWN"),
      requests: numberValue(record, ["requests", "aiRequests", "totalRequests"]),
      tokens: numberValue(record, ["tokens", "totalTokens"]),
      estimatedCost: numberValue(record, ["estimatedCost", "cost"]),
      lastUsed: text(record, ["lastUsed", "lastUsedAt", "updatedAt"], ""),
    }));

    return {
      summary: {
        totalRequests: numberValue(summary, ["totalRequests", "totalAIRequests"]),
        freePlanUsage: numberValue(summary, ["freePlanUsage", "freeUsage"]),
        paidPlanUsage: numberValue(summary, ["paidPlanUsage", "paidUsage"]),
        costThisMonth: numberValue(summary, ["costThisMonth", "aiCostThisMonth", "monthlyCost"]),
        averageCostPerUser: numberValue(summary, ["averageCostPerUser", "avgCostPerUser"]),
        revenueImpact: numberValue(summary, ["revenueImpact", "aiRevenueImpact"]),
      },
      requests: pickArray(data, ["requests", "requestsOverTime", "aiRequestsOverTime"]).map(toMetricPoint),
      costs: pickArray(data, ["costs", "costOverTime", "aiCostOverTime"]).map(toMetricPoint),
      usage: rows,
      raw: data,
    };
  },
};
