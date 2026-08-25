import { useQuery } from "@tanstack/react-query";
import { mockUsage, mockUser } from "@/src/mocks/customer/data";

export function useSubscription() {
  return useQuery({ queryKey: ["customer", "subscription"], queryFn: async () => ({ plan: mockUser.plan, usage: mockUsage }) });
}
