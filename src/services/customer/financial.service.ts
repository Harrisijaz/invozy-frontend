import { integrationPending } from "./integration";

export const financialService = {
  dashboard: () => integrationPending("financialService.dashboard"),
  reports: () => integrationPending("financialService.reports"),
};
