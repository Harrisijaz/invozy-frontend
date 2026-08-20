import { api } from "@/lib/api";
import { asRecord, pickArray, text } from "@/lib/normalize";
import type { DismissFlagRequest, ModerationFlag } from "@/types/admin/moderation";

function flag(value: unknown, index: number): ModerationFlag {
  const record = asRecord(value);
  return {
    id: text(record, ["id", "flagId"], `flag-${index}`),
    flagId: text(record, ["flagId", "id"], `flag-${index}`),
    userId: text(record, ["userId"], ""),
    user: text(record, ["user", "userEmail", "email", "userName"], "Unknown user"),
    reason: text(record, ["reason", "description"], ""),
    riskLevel: text(record, ["riskLevel", "risk"], "UNKNOWN"),
    detectedAt: text(record, ["detectedAt", "createdAt"], ""),
    status: text(record, ["status"], "UNKNOWN"),
    raw: value,
  };
}

export const moderationService = {
  async getFlags() {
    const { data } = await api.get<unknown>("/admin/moderation/flags");
    return pickArray(data, ["flags", "data", "items", "content"]).map(flag);
  },

  async dismissFlag(flagId: string, note: string) {
    const { data } = await api.post<unknown>(`/admin/moderation/flags/${flagId}/dismiss`, { note } satisfies DismissFlagRequest);
    return data;
  },

  async trustUser(userId: string) {
    const { data } = await api.post<unknown>(`/admin/moderation/users/${userId}/trusted`);
    return data;
  },
};
