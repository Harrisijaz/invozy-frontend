"use client";

export { useChangePlan, useSubscriptions } from "@/hooks/admin/useBilling";

export function useSubscriptionHistory() {
  return { data: [], isLoading: false };
}

export function useCancelSubscription() {
  return {
    mutate: () => undefined,
    isPending: false,
  };
}
