import { integrationPending } from "./integration";

export const paymentService = {
  generatePaymentLink: () => integrationPending("paymentService.generatePaymentLink"),
};
