export interface MetricPoint {
  label: string;
  value: number;
  previous?: number;
}

export interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  comparison: string;
}

export interface AnalyticsSummary {
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
}
