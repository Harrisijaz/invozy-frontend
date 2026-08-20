import { api } from "@/lib/api";
import { asRecord, pickArray, text } from "@/lib/normalize";
import type { ActivityLog } from "@/types/admin/activity-log";

function activityLog(value: unknown, index: number): ActivityLog {
  const record = asRecord(value);
  return {
    id: text(record, ["id"], `activity-${index}`),
    admin: text(record, ["admin", "adminName", "actor", "createdBy"], "Admin"),
    action: text(record, ["action", "event"], ""),
    target: text(record, ["target", "targetEmail", "resource"], ""),
    ipAddress: text(record, ["ipAddress", "ip"], ""),
    timestamp: text(record, ["timestamp", "createdAt", "date"], ""),
    result: text(record, ["result", "status"], ""),
    raw: value,
  };
}

export const activityLogsService = {
  async getActivityLogs() {
    const { data } = await api.get<unknown>("/admin/activity-logs");
    return pickArray(data, ["logs", "activityLogs", "data", "items", "content"]).map(activityLog);
  },
};
