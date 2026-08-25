import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockInvoices } from "@/src/mocks/customer/data";
import { invoiceService } from "@/src/services/customer/invoice.service";

export function useInvoices() {
  return useQuery({ queryKey: ["customer", "invoices"], queryFn: async () => mockInvoices });
}

export function useInvoice(id: string) {
  return useQuery({ queryKey: ["customer", "invoices", id], queryFn: async () => mockInvoices.find((invoice) => invoice.id === id) ?? null });
}

export function useMarkInvoicePaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invoiceService.markPaid,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
}
