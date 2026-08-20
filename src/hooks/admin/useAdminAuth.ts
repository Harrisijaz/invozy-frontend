"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogin, adminLogout } from "@/services/admin/auth.service";

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => adminLogin(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "user"], data.userInfo);
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => adminLogout(),
    onSuccess: () => queryClient.clear(),
  });
}
