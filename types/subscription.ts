import type { UserPlan } from "./user";

export interface Subscription {
  id: string;
  user: string;
  email: string;
  plan: UserPlan;
  status: "Active" | "Cancelled" | "Trial" | "Past Due";
  startDate: string;
  renewalDate: string;
}

export interface SubscriptionHistory {
  id: string;
  previousPlan: UserPlan;
  newPlan: UserPlan;
  action: string;
  date: string;
  changedBy: string;
}
