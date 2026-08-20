"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing.service";

export function usePayments() {
  return useQuery({ queryKey: ["payments"], queryFn: billingService.getPayments });
}

export function useRefunds() {
  return useQuery({ queryKey: ["refunds"], queryFn: billingService.getRefunds });
}

export function useRequestRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billingService.requestRefund,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["refunds"] }),
  });
}
