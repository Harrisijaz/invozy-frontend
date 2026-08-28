import { invoiceService } from "./invoice.service";

export const aiService = {
  generateInvoiceDraft: invoiceService.generateDraft,
};
