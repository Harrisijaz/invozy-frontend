import { api } from "@/lib/api";
import { clearSession, persistSession } from "@/lib/auth";
import type { ActivityLog, Admin, AuthSession } from "@/types";
import { activityLogs } from "@/mocks/activity-logs";

const mockAdmin: Admin = {
  id: "adm_1",
  name: "Haris",
  email: "admin@invozy.com",
  role: "SUPER_ADMIN",
};

const delay = <T,>(data: T, ms = 280) => new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

export const adminService = {
  async login(payload: { email: string; password: string }) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.post<AuthSession>("/admin/auth/login", payload);
      persistSession(data);
      return data;
    }
    if (!payload.email || payload.password.length < 8) {
      throw new Error("Invalid admin credentials.");
    }
    const session = { token: "mock-admin-session-token", admin: mockAdmin };
    persistSession(session);
    return delay(session);
  },
  async forgotPassword(email: string) {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      await api.post("/admin/auth/forgot-password", { email });
    }
    return delay({ ok: true });
  },
  async me() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<Admin>("/admin/auth/me");
      return data;
    }
    return delay(mockAdmin);
  },
  async logout() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      await api.post("/admin/auth/logout");
    }
    clearSession();
  },
  async getActivityLogs() {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      const { data } = await api.get<ActivityLog[]>("/admin/activity-logs");
      return data;
    }
    return delay(activityLogs);
  },
};
