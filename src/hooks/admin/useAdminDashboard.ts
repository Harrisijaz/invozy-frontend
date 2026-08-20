"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/admin/analytics.service";
import type { AdminDashboardParams } from "@/types/admin/analytics";

export function useAdminDashboard(params?: AdminDashboardParams) {
  return useQuery({
    queryKey: ["admin-dashboard", params],
    queryFn: () => analyticsService.getDashboard(params),
  });
}

export function useAIUsage(params?: { billingCycleStart?: string }) {
  return useQuery({
    queryKey: ["ai-usage", params],
    queryFn: () => analyticsService.getAIUsage(params),
  });
}
