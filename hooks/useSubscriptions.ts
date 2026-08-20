"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsService } from "@/services/subscriptions.service";

export function useSubscriptions() {
  return useQuery({ queryKey: ["subscriptions"], queryFn: subscriptionsService.getSubscriptions });
}

export function useSubscriptionHistory() {
  return useQuery({ queryKey: ["subscriptions", "history"], queryFn: subscriptionsService.getHistory });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionsService.cancelSubscription,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}
