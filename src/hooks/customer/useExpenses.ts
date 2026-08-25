import { useQuery } from "@tanstack/react-query";
import { mockExpenses } from "@/src/mocks/customer/data";

export function useExpenses() {
  return useQuery({ queryKey: ["customer", "expenses"], queryFn: async () => mockExpenses });
}
