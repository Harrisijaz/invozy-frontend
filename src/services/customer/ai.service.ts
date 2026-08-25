import { integrationPending } from "./integration";

export const aiService = {
  generateInvoiceDraft: () => integrationPending("aiService.generateInvoiceDraft"),
};
