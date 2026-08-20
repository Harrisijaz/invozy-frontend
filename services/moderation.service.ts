import { api } from "@/lib/api";
import type { ModerationFlag } from "@/types";
import { moderationFlags } from "@/mocks/moderation";

const delay = <T,>(data: T) => new Promise<T>((resolve) => setTimeout(() => resolve(data), 240));

export const moderationService = {
  async getFlags() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<ModerationFlag[]>("/admin/moderation");
      return data;
    }
    return delay(moderationFlags);
  },
  async dismissFlag(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") await api.post(`/admin/moderation/${id}/dismiss`);
    return delay({ ok: true });
  },
};
