import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/common/toast";
import { getStoredUserInfo } from "@/lib/auth";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { openPaddleCheckout } from "@/src/lib/customer/paddle";
import { subscriptionService } from "@/src/services/customer/subscription.service";
import { subscriptionToUsage } from "@/src/lib/customer/normalize";

export function useSubscription() {
  const userId = getStoredUserInfo()?.userId ?? "anonymous";

  return useQuery({
    queryKey: ["customer", "subscription", userId],
    queryFn: async () => {
      const subscription = await subscriptionService.current();
      return { subscription, plan: subscription.planType, usage: subscriptionToUsage(subscription) };
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    staleTime: 0,
  });
}

export function useCreateCheckout() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const checkout = await subscriptionService.upgrade();
      await openPaddleCheckout(checkout.transactionId ?? "", "subscription");
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
