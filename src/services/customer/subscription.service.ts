import { integrationPending } from "./integration";

export const subscriptionService = {
  current: () => integrationPending("subscriptionService.current"),
  upgrade: () => integrationPending("subscriptionService.upgrade"),
  cancel: () => integrationPending("subscriptionService.cancel"),
};
