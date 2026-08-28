import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/src/services/customer/auth.service";
import { settingsService } from "@/src/services/customer/settings.service";
import type { SettingsResponse } from "@/src/types/customer";

export function useSettings() {
  return useQuery({ queryKey: ["customer", "settings"], queryFn: settingsService.get });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SettingsResponse) => settingsService.update(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "settings"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: authService.changePassword });
}
