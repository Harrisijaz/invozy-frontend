import { api } from "@/lib/api";
import type { Subscription, SubscriptionHistory } from "@/types";
import { subscriptionHistory, subscriptions } from "@/mocks/subscriptions";

const delay = <T,>(data: T) => new Promise<T>((resolve) => setTimeout(() => resolve(data), 240));

export const subscriptionsService = {
  async getSubscriptions() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<Subscription[]>("/admin/subscriptions");
      return data;
    }
    return delay(subscriptions);
  },
  async getHistory() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<SubscriptionHistory[]>("/admin/subscriptions/history");
      return data;
    }
    return delay(subscriptionHistory);
  },
  async cancelSubscription(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") await api.post(`/admin/subscriptions/${id}/cancel`);
    return delay({ ok: true });
  },
};
