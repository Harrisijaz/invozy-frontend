"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export function useAdmin() {
  return useQuery({ queryKey: ["admin", "me"], queryFn: adminService.me });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.login,
    onSuccess: (session) => queryClient.setQueryData(["admin", "me"], session.admin),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.logout,
    onSuccess: () => queryClient.clear(),
  });
}

export function useActivityLogs() {
  return useQuery({ queryKey: ["activity-logs"], queryFn: adminService.getActivityLogs });
}
