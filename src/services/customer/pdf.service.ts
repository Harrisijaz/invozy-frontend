import { integrationPending } from "./integration";

export const pdfService = {
  downloadInvoice: () => integrationPending("pdfService.downloadInvoice"),
  downloadQuotation: () => integrationPending("pdfService.downloadQuotation"),
  downloadFinancialReport: () => integrationPending("pdfService.downloadFinancialReport"),
};
