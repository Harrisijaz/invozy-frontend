import { invoiceService } from "./invoice.service";

export const paymentService = {
  generatePaymentLink: invoiceService.paymentLink,
};
