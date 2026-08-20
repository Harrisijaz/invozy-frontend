"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/admin/support.service";

export function useUserSupportRecords(userId: string) {
  return useQuery({
    queryKey: ["support-records", userId],
    queryFn: () => supportService.getUserRecords(userId),
    enabled: Boolean(userId),
  });
}

export function useTriggerPasswordReset() {
  return useMutation({
    mutationFn: (userId: string) => supportService.triggerPasswordReset(userId),
  });
}

export function useAddInternalNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, note }: { userId: string; note: string }) => supportService.addInternalNote(userId, note),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["support-records", variables.userId] });
    },
  });
}
