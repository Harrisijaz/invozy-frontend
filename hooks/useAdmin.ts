"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoredAdminUser } from "@/lib/auth";
import { useAdminLogin, useAdminLogout } from "@/hooks/admin/useAdminAuth";
import { useActivityLogs } from "@/hooks/admin/useActivityLogs";

export function useAdmin() {
  return useQuery({
    queryKey: ["admin", "user"],
    queryFn: async () => getStoredAdminUser(),
  });
}

export const useLogin = useAdminLogin;
export const useLogout = useAdminLogout;
export { useActivityLogs };
