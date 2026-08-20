import { api } from "@/lib/api";
import { clearAdminSession, storeAdminSession } from "@/lib/auth";
import type { AdminLoginRequest, AdminLoginResponse } from "@/types/admin/auth";

export async function adminLogin(email: string, password: string) {
  const { data } = await api.post<AdminLoginResponse>("/admin/auth/login", {
    email,
    password,
  } satisfies AdminLoginRequest);

  storeAdminSession(data.accessToken, data.userInfo);
  return data;
}

export function adminLogout() {
  clearAdminSession();
}
