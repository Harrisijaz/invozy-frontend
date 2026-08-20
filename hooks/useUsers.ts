"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";

export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: usersService.getUsers });
}

export function useUser(id: string) {
  return useQuery({ queryKey: ["users", id], queryFn: () => usersService.getUserById(id), enabled: Boolean(id) });
}

export function useUserDetails(id: string) {
  const invoices = useQuery({ queryKey: ["users", id, "invoices"], queryFn: () => usersService.getUserInvoices(id), enabled: Boolean(id) });
  const expenses = useQuery({ queryKey: ["users", id, "expenses"], queryFn: () => usersService.getUserExpenses(id), enabled: Boolean(id) });
  const notes = useQuery({ queryKey: ["users", id, "notes"], queryFn: () => usersService.getInternalNotes(id), enabled: Boolean(id) });
  return { invoices, expenses, notes };
}

export function useUserActions() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  return {
    block: useMutation({ mutationFn: usersService.blockUser, onSuccess: invalidate }),
    unblock: useMutation({ mutationFn: usersService.unblockUser, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: usersService.deleteUser, onSuccess: invalidate }),
    resetPassword: useMutation({ mutationFn: usersService.triggerPasswordReset }),
    addNote: useMutation({ mutationFn: ({ id, note }: { id: string; note: string }) => usersService.addInternalNote(id, note), onSuccess: invalidate }),
  };
}
