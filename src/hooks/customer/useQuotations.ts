import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockQuotations } from "@/src/mocks/customer/data";
import { quotationService } from "@/src/services/customer/quotation.service";

export function useQuotations() {
  return useQuery({ queryKey: ["customer", "quotations"], queryFn: async () => mockQuotations });
}

export function useConvertQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quotationService.convertToInvoice,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "quotations"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
    },
  });
}
