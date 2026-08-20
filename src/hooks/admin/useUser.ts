"use client";

import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/services/admin/users.service";

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => usersService.getUser(userId),
    enabled: Boolean(userId),
  });
}
