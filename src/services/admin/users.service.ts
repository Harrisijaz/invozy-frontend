import { api } from "@/lib/api";
import { asRecord, numberValue, pickArray, pickRecord, text } from "@/lib/normalize";
import type { AdminUserDetails, AdminUserRow, BlockUserRequest, DeleteUserRequest, GetUsersParams, PaginatedUsers } from "@/types/admin/user";

function toUserRow(value: unknown, index = 0): AdminUserRow {
  const record = asRecord(value);
  const id = text(record, ["id", "userId", "_id"], `user-${index}`);
  return {
    id,
    name: text(record, ["fullName", "name", "username"], "Unknown user"),
    email: text(record, ["email"], ""),
    plan: text(record, ["plan", "planType", "subscriptionPlan"], "UNKNOWN"),
    status: text(record, ["status", "accountStatus"], "UNKNOWN"),
    signupDate: text(record, ["createdAt", "signupDate", "registeredAt"], ""),
    revenue: numberValue(record, ["revenue", "totalRevenue", "amountPaid"]),
    raw: value,
  };
}

export const usersService = {
  async getUsers(params: GetUsersParams = { page: 1, limit: 20 }): Promise<PaginatedUsers> {
    const { data } = await api.get<unknown>("/admin/users", { params });
    const usersPage = pickRecord(data, ["users"]);
    const users = pickArray(usersPage, ["content", "users", "data", "items"]).map(toUserRow);
    const fallbackUsers = users.length ? users : pickArray(data, ["content", "data", "items"]).map(toUserRow);

    return {
      users: fallbackUsers,
      page: numberValue(usersPage, ["page", "currentPage", "number"], params.page ?? 1) + (usersPage.number !== undefined ? 1 : 0),
      limit: numberValue(usersPage, ["limit", "pageSize", "size"], params.limit ?? 20),
      total: numberValue(usersPage, ["total", "totalElements", "totalItems"], undefined as unknown as number),
      totalPages: numberValue(usersPage, ["totalPages", "pages"], undefined as unknown as number),
      raw: data,
    };
  },

  async exportUsers() {
    const response = await api.get<Blob>("/admin/users/export", { responseType: "blob" });
    return response.data;
  },

  async getUser(userId: string): Promise<AdminUserDetails> {
    const { data } = await api.get<unknown>(`/admin/users/${userId}`);
    const row = toUserRow(data);
    const record = asRecord(data);
    return {
      ...row,
      fullName: text(record, ["fullName", "name"], row.name),
      emailVerified: typeof record.emailVerified === "boolean" ? record.emailVerified : undefined,
      invoices: numberValue(record, ["invoices", "totalInvoices"]),
      expenses: numberValue(record, ["expenses", "totalExpenses"]),
      payments: numberValue(record, ["payments", "totalPayments"]),
    };
  },

  async blockUser(userId: string, reason: string) {
    const { data } = await api.post<unknown>(`/admin/users/${userId}/block`, { reason } satisfies BlockUserRequest);
    return data;
  },

  async unblockUser(userId: string) {
    const { data } = await api.post<unknown>(`/admin/users/${userId}/unblock`);
    return data;
  },

  async deleteUser(userId: string, body: DeleteUserRequest) {
    const { data } = await api.delete<unknown>(`/admin/users/${userId}`, { data: body });
    return data;
  },
};
