"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { moderationService } from "@/services/admin/moderation.service";

export function useModerationFlags() {
  return useQuery({
    queryKey: ["moderation-flags"],
    queryFn: moderationService.getFlags,
  });
}

export function useDismissFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ flagId, note }: { flagId: string; note: string }) => moderationService.dismissFlag(flagId, note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["moderation-flags"] });
    },
  });
}

export function useTrustUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => moderationService.trustUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["moderation-flags"] });
    },
  });
}
