import { customerApi } from "@/src/lib/customer/api";
import type { Subscription } from "@/src/types/customer";

export const subscriptionService = {
  async current() {
    const response = await customerApi.get<Subscription>("/subscription");
    return response.data;
  },
  async upgrade() {
    const response = await customerApi.post<{ url: string }>("/subscription/checkout");
    return response.data;
  },
  async cancel() {
    const response = await customerApi.post<Subscription>("/subscription/cancel");
    return response.data;
  },
};
