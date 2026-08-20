import type { Subscription, SubscriptionHistory } from "@/types";

export const subscriptions: Subscription[] = [
  { id: "sub_1", user: "Avery Johnson", email: "avery@northstar.co", plan: "Business", status: "Active", startDate: "2026-01-08", renewalDate: "2026-09-08" },
  { id: "sub_2", user: "Mina Patel", email: "mina@ledgerly.io", plan: "Pro", status: "Active", startDate: "2026-02-14", renewalDate: "2026-09-14" },
  { id: "sub_3", user: "Chris Morgan", email: "chris@pilotops.com", plan: "Free", status: "Trial", startDate: "2026-07-20", renewalDate: "2026-08-20" },
  { id: "sub_4", user: "Sara Lee", email: "sara@arcstudio.dev", plan: "Starter", status: "Past Due", startDate: "2025-11-17", renewalDate: "2026-08-17" },
  { id: "sub_5", user: "Nora Smith", email: "nora@clearcash.com", plan: "Pro", status: "Cancelled", startDate: "2025-08-26", renewalDate: "2026-07-26" },
];

export const subscriptionHistory: SubscriptionHistory[] = [
  { id: "hist_1", previousPlan: "Starter", newPlan: "Pro", action: "Upgrade", date: "2026-05-14", changedBy: "Haris" },
  { id: "hist_2", previousPlan: "Pro", newPlan: "Business", action: "Upgrade", date: "2026-07-01", changedBy: "Ayesha" },
  { id: "hist_3", previousPlan: "Business", newPlan: "Pro", action: "Downgrade", date: "2026-08-12", changedBy: "System" },
];
