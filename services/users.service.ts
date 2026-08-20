import { api } from "@/lib/api";
import type { Expense, InternalNote, Invoice, User } from "@/types";
import { expenses, internalNotes, invoices, users } from "@/mocks/users";

const delay = <T,>(data: T, ms = 240) => new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

export const usersService = {
  async getUsers() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<User[]>("/admin/users");
      return data;
    }
    return delay(users);
  },
  async getUserById(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<User>(`/admin/users/${id}`);
      return data;
    }
    return delay(users.find((user) => user.id === id) ?? users[0]);
  },
  async getUserInvoices(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<Invoice[]>(`/admin/users/${id}/invoices`);
      return data;
    }
    return delay(invoices);
  },
  async getUserExpenses(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<Expense[]>(`/admin/users/${id}/expenses`);
      return data;
    }
    return delay(expenses);
  },
  async getInternalNotes(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<InternalNote[]>(`/admin/users/${id}/notes`);
      return data;
    }
    return delay(internalNotes);
  },
  async blockUser(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") await api.post(`/admin/users/${id}/block`);
    return delay({ ok: true });
  },
  async unblockUser(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") await api.post(`/admin/users/${id}/unblock`);
    return delay({ ok: true });
  },
  async deleteUser(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") await api.delete(`/admin/users/${id}`);
    return delay({ ok: true });
  },
  async triggerPasswordReset(id: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") await api.post(`/admin/users/${id}/password-reset`);
    return delay({ ok: true });
  },
  async addInternalNote(id: string, note: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.post<InternalNote>(`/admin/users/${id}/notes`, { note });
      return data;
    }
    return delay({ id: crypto.randomUUID(), note, admin: "Haris", createdAt: new Date().toISOString() });
  },
};
