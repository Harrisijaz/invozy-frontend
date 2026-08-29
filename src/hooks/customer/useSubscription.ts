import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/common/toast";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { openPaddleCheckout } from "@/src/lib/customer/paddle";
import { subscriptionService } from "@/src/services/customer/subscription.service";
import { subscriptionToUsage } from "@/src/lib/customer/normalize";

export function useSubscription() {
  return useQuery({
    queryKey: ["customer", "subscription"],
    queryFn: async () => {
      const subscription = await subscriptionService.current();
      return { subscription, plan: subscription.planType, usage: subscriptionToUsage(subscription) };
    },
  });
}

export function useCreateCheckout() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const checkout = await subscriptionService.upgrade();
      await openPaddleCheckout(checkout.transactionId ?? "");
      return checkout;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "subscription"] });
    },
    onError: (error) => {
      toast(getCustomerApiErrorMessage(error, error instanceof Error ? error.message : "Unable to open Paddle checkout."), "error");
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "subscription"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
}
