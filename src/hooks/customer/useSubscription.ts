import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: subscriptionService.upgrade,
    onSuccess: ({ url }) => {
      window.location.assign(url);
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
