export interface AdminDashboardParams {
  startDate?: string;
  endDate?: string;
}

export interface AIUsageParams {
  billingCycleStart?: string;
}

export interface MetricPoint {
  label: string;
  value: number;
  previous?: number;
}

export interface DashboardMetric {
  label: string;
  value: number;
  change?: number;
  comparison?: string;
}

export interface AdminDashboardView {
  totalUsers: DashboardMetric;
  freeUsers: DashboardMetric;
  paidUsers: DashboardMetric;
  monthlyRevenue: DashboardMetric;
  churnRate: number;
  cancelledPaidSubscriptions: number;
  retainedUsers: number;
  revenue: MetricPoint[];
  signups: MetricPoint[];
  churn: MetricPoint[];
  raw: unknown;
}

export interface AIUsageRow {
  id: string;
  userId: string;
  user: string;
  plan: string;
  requests: number;
  tokens: number;
  estimatedCost: number;
  lastUsed: string;
}

export interface AIUsageView {
  summary: {
    totalRequests: number;
    freePlanUsage: number;
    paidPlanUsage: number;
    costThisMonth: number;
    averageCostPerUser: number;
    revenueImpact: number;
  };
  requests: MetricPoint[];
  costs: MetricPoint[];
  usage: AIUsageRow[];
  raw: unknown;
}
