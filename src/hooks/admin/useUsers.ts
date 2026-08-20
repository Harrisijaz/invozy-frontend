"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/admin/users.service";
import type { DeleteUserRequest, GetUsersParams } from "@/types/admin/user";

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => usersService.getUsers(params),
  });
}

export function useExportUsers() {
  return useMutation({
    mutationFn: usersService.exportUsers,
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => usersService.blockUser(userId, reason),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-user", variables.userId] });
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => usersService.unblockUser(userId),
    onSuccess: async (_, userId) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: DeleteUserRequest }) => usersService.deleteUser(userId, body),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-user", variables.userId] });
    },
  });
}
