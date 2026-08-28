import { customerApi } from "@/src/lib/customer/api";
import type { InvoiceResponse, QuotationRequest, QuotationResponse } from "@/src/types/customer";

export const quotationService = {
  async detail(id: string) {
    const response = await customerApi.get<QuotationResponse>(`/quotations/${id}`);
    return response.data;
  },
  async create(payload: QuotationRequest) {
    const response = await customerApi.post<QuotationResponse>("/quotations", payload);
    return response.data;
  },
  async convertToInvoice(id: string) {
    const response = await customerApi.post<InvoiceResponse>(`/quotations/${id}/convert`);
    return response.data;
  },
};
