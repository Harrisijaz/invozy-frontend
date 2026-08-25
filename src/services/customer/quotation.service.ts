import { integrationPending } from "./integration";

export const quotationService = {
  list: () => integrationPending("quotationService.list"),
  detail: () => integrationPending("quotationService.detail"),
  create: () => integrationPending("quotationService.create"),
  update: () => integrationPending("quotationService.update"),
  softDelete: () => integrationPending("quotationService.softDelete"),
  convertToInvoice: () => integrationPending("quotationService.convertToInvoice"),
};
