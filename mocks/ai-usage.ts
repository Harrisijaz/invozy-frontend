import type { AIUsage, AIUsageSummary, MetricPoint } from "@/types";

export const aiUsageSummary: AIUsageSummary = {
  totalRequests: 184920,
  freePlanUsage: 38200,
  paidPlanUsage: 146720,
  costThisMonth: 8420,
  averageCostPerUser: 1.82,
  revenueImpact: 46300,
};

export const aiUsage: AIUsage[] = [
  { id: "ai_1", user: "Daniel Kim", plan: "Business", requests: 39200, tokens: 18400000, estimatedCost: 1180, lastUsed: "2026-08-20T09:42:00.000Z" },
  { id: "ai_2", user: "Avery Johnson", plan: "Business", requests: 28100, tokens: 12800000, estimatedCost: 840, lastUsed: "2026-08-20T08:15:00.000Z" },
  { id: "ai_3", user: "Mina Patel", plan: "Pro", requests: 7300, tokens: 3100000, estimatedCost: 212, lastUsed: "2026-08-19T19:20:00.000Z" },
  { id: "ai_4", user: "Chris Morgan", plan: "Free", requests: 4200, tokens: 1900000, estimatedCost: 124, lastUsed: "2026-08-18T12:02:00.000Z" },
];

export const aiRequests: MetricPoint[] = [
  { label: "Mon", value: 21400 },
  { label: "Tue", value: 26800 },
  { label: "Wed", value: 24100 },
  { label: "Thu", value: 31900 },
  { label: "Fri", value: 28700 },
  { label: "Sat", value: 17200 },
  { label: "Sun", value: 14900 },
];

export const aiCosts: MetricPoint[] = [
  { label: "Mon", value: 980 },
  { label: "Tue", value: 1240 },
  { label: "Wed", value: 1130 },
  { label: "Thu", value: 1480 },
  { label: "Fri", value: 1320 },
  { label: "Sat", value: 810 },
  { label: "Sun", value: 690 },
];
