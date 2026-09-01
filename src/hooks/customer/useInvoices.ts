import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "@/src/services/customer/invoice.service";
import { normalizeInvoice } from "@/src/lib/customer/normalize";
import type { InvoiceFilters, InvoiceRequest } from "@/src/types/customer";

export function useInvoices(filters: InvoiceFilters = {}) {
  return useQuery({
    queryKey: ["customer", "invoices", filters],
    queryFn: async () => {
      const page = await invoiceService.list(filters);
      return { ...page, items: page.items.map(normalizeInvoice) };
    },
    refetchInterval: (query) => query.state.data?.items.some((invoice) => invoice.status === "PAYMENT_PROCESSING") ? 30_000 : false,
    refetchIntervalInBackground: false,
  });
}

export function useInvoice(id: string, enabled = true) {
  return useQuery({
    queryKey: ["customer", "invoices", id],
    queryFn: async () => normalizeInvoice(await invoiceService.detail(id)),
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => query.state.data?.status === "PAYMENT_PROCESSING" ? 8_000 : false,
    refetchIntervalInBackground: false,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoiceRequest) => invoiceService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "subscription"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invoiceService.update,
    onSuccess: (invoice) => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices", String(invoice.id)] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
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

export function usePublishInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invoiceService.publish,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invoiceService.softDelete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
      void queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
}

export function useInvoicePaymentLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invoiceService.paymentLink,
    onSuccess: async (_, invoiceId) => {
      await queryClient.invalidateQueries({ queryKey: ["customer", "invoices"] });
      await queryClient.invalidateQueries({ queryKey: ["customer", "invoices", invoiceId] });
      await queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
    },
  });
}

export function useAiInvoiceDraft() {
  return useMutation({ mutationFn: invoiceService.generateDraft });
}
