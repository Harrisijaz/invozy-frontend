import { customerApi } from "@/src/lib/customer/api";
import type { AiInvoiceDraft, InvoiceFilters, InvoiceRequest, InvoiceResponse, PageResponse, PaymentLinkResponse } from "@/src/types/customer";

export const invoiceService = {
  async list(filters: InvoiceFilters = {}) {
    const { status, ...params } = filters;
    const response = await customerApi.get<PageResponse<InvoiceResponse>>("/invoices", {
      params: { page: 0, size: 20, ...params, ...(status && status !== "ALL" ? { status } : {}) },
    });
    return response.data;
  },
  async detail(id: string) {
    const response = await customerApi.get<InvoiceResponse>(`/invoices/${id}`);
    return response.data;
  },
  async create(payload: InvoiceRequest) {
    const response = await customerApi.post<InvoiceResponse>("/invoices", payload);
    return response.data;
  },
  async update({ id, payload }: { id: string; payload: InvoiceRequest }) {
    const response = await customerApi.put<InvoiceResponse>(`/invoices/${id}`, payload);
    return response.data;
  },
  async updateNotes({ id, internalNotes }: { id: string; internalNotes: string }) {
    const response = await customerApi.put<InvoiceResponse>(`/invoices/${id}/notes`, { internalNotes });
    return response.data;
  },
  async softDelete(id: string) {
    await customerApi.delete(`/invoices/${id}`);
  },
  async markPaid(id: string) {
    const response = await customerApi.post<InvoiceResponse>(`/invoices/${id}/mark-paid`);
    return response.data;
  },
  async publish(id: string) {
    const response = await customerApi.post<InvoiceResponse>(`/invoices/${id}/publish`);
    return response.data;
  },
  async paymentLink(id: string) {
    const response = await customerApi.post<PaymentLinkResponse>(`/invoices/${id}/payment-link`);
    return response.data;
  },
  async generateDraft(prompt: string) {
    const response = await customerApi.post<AiInvoiceDraft>("/invoices/ai-generate", { prompt });
    return response.data;
  },
};
