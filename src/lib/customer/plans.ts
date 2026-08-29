import type { PlanCode, Subscription } from "@/src/types/customer";

export function isPaidPlan(plan?: PlanCode | string | null) {
  return ["paid", "pro", "premium"].includes(String(plan ?? "").toLowerCase());
}

export function isActivePaidSubscription(subscription?: Subscription | null) {
  return isPaidPlan(subscription?.planType) && subscription?.status?.toLowerCase() === "active";
}
