"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { moderationService } from "@/services/moderation.service";

export function useModeration() {
  return useQuery({ queryKey: ["moderation"], queryFn: moderationService.getFlags });
}

export function useDismissFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moderationService.dismissFlag,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["moderation"] }),
  });
}
