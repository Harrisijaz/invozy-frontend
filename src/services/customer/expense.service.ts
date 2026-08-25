import { integrationPending } from "./integration";

export const expenseService = {
  list: () => integrationPending("expenseService.list"),
  create: () => integrationPending("expenseService.create"),
};
