import type { UserPlan } from "./user";

export interface AIUsage {
  id: string;
  user: string;
  plan: UserPlan;
  requests: number;
  tokens: number;
  estimatedCost: number;
  lastUsed: string;
}

export interface AIUsageSummary {
  totalRequests: number;
  freePlanUsage: number;
  paidPlanUsage: number;
  costThisMonth: number;
  averageCostPerUser: number;
  revenueImpact: number;
}
