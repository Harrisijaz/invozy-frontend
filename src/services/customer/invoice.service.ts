import { integrationPending } from "./integration";

export const invoiceService = {
  list: () => integrationPending("invoiceService.list"),
  detail: () => integrationPending("invoiceService.detail"),
  create: () => integrationPending("invoiceService.create"),
  update: () => integrationPending("invoiceService.update"),
  softDelete: () => integrationPending("invoiceService.softDelete"),
  markPaid: () => integrationPending("invoiceService.markPaid"),
};
