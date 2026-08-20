import type { AnalyticsSummary } from "@/types";

export const analytics: AnalyticsSummary = {
  totalUsers: { label: "Total Users", value: 12840, change: 12.4, comparison: "vs last month" },
  freeUsers: { label: "Free Users", value: 8210, change: 7.8, comparison: "vs last month" },
  paidUsers: { label: "Paid Users", value: 4630, change: 15.1, comparison: "vs last month" },
  monthlyRevenue: { label: "Monthly Revenue", value: 98420, change: 18.6, comparison: "vs last month" },
  churnRate: 2.7,
  cancelledPaidSubscriptions: 124,
  retainedUsers: 4506,
  revenue: [
    { label: "Mar", value: 64200, previous: 58400 },
    { label: "Apr", value: 71800, previous: 63100 },
    { label: "May", value: 76400, previous: 68900 },
    { label: "Jun", value: 83200, previous: 74100 },
    { label: "Jul", value: 90100, previous: 79600 },
    { label: "Aug", value: 98420, previous: 83010 },
  ],
  signups: [
    { label: "Mon", value: 82 },
    { label: "Tue", value: 106 },
    { label: "Wed", value: 96 },
    { label: "Thu", value: 132 },
    { label: "Fri", value: 118 },
    { label: "Sat", value: 74 },
    { label: "Sun", value: 69 },
  ],
  churn: [
    { label: "Mar", value: 3.4 },
    { label: "Apr", value: 3.1 },
    { label: "May", value: 2.9 },
    { label: "Jun", value: 3.0 },
    { label: "Jul", value: 2.8 },
    { label: "Aug", value: 2.7 },
  ],
};
