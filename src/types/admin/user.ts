export type AdminUserPlanFilter = "FREE" | "PAID";
export type AdminUserStatusFilter = "UNVERIFIED" | "ACTIVE" | "BLOCKED" | "DELETED";
export type AdminUserSortBy = "createdAt" | "status";
export type SortDirection = "asc" | "desc";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  plan?: AdminUserPlanFilter;
  status?: AdminUserStatusFilter;
  sortBy?: AdminUserSortBy;
  direction?: SortDirection;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  signupDate: string;
  revenue: number;
  raw: unknown;
}

export interface PaginatedUsers {
  users: AdminUserRow[];
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
  raw: unknown;
}

export interface AdminUserDetails extends AdminUserRow {
  fullName: string;
  emailVerified?: boolean;
  invoices?: number;
  expenses?: number;
  payments?: number;
}

export interface BlockUserRequest {
  reason: string;
}

export interface DeleteUserRequest {
  confirmationEmail: string;
  cancelSubscriptionFirst: boolean;
}
