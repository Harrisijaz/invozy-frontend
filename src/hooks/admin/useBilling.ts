"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/admin/billing.service";
import type { ChangePlanRequest, RefundPaymentRequest } from "@/types/admin/billing";

export function useSubscriptions(userId: string) {
  return useQuery({
    queryKey: ["user-subscriptions", userId],
    queryFn: () => billingService.getUserSubscriptions(userId),
    enabled: Boolean(userId),
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: ChangePlanRequest }) => billingService.changeUserPlan(userId, body),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["user-subscriptions", variables.userId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-user", variables.userId] });
    },
  });
}

export function useFailedPendingPayments() {
  return useQuery({
    queryKey: ["failed-pending-payments"],
    queryFn: billingService.getFailedPendingPayments,
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, body }: { paymentId: string; body: RefundPaymentRequest }) => billingService.refundPayment(paymentId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["failed-pending-payments"] });
    },
  });
}
