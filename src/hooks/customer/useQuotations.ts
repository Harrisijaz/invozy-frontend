import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quotationService } from "@/src/services/customer/quotation.service";
import { normalizeInvoice, normalizeQuotation } from "@/src/lib/customer/normalize";
import type { QuotationRequest } from "@/src/types/customer";

export function useQuotation(id: string, enabled = true) {
  return useQuery({
    queryKey: ["customer", "quotations", id],
    queryFn: async () => normalizeQuotation(await quotationService.detail(id)),
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateQuotation() {
  return useMutation({
    mutationFn: (payload: QuotationRequest) => quotationService.create(payload),
  });
}

export function useConvertQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => normalizeInvoice(await quotationService.convertToInvoice(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
}
