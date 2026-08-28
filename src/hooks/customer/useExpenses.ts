import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "@/src/services/customer/expense.service";
import type { ExpenseRequest } from "@/src/types/customer";

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExpenseRequest) => expenseService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "finance-summary"] });
    },
  });
}
