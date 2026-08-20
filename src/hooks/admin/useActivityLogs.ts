"use client";

import { useQuery } from "@tanstack/react-query";
import { activityLogsService } from "@/services/admin/activity-logs.service";

export function useActivityLogs() {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: activityLogsService.getActivityLogs,
  });
}
