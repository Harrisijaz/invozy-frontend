"use client";

import { useQuery } from "@tanstack/react-query";
import { aiUsageService } from "@/services/ai-usage.service";

export function useAIUsage() {
  return useQuery({ queryKey: ["ai-usage"], queryFn: aiUsageService.getAIUsage });
}
