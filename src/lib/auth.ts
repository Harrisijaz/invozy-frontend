"use client";

import type { AdminUser } from "@/types/admin/auth";

export function storeAdminSession(accessToken: string, user: AdminUser) {
  localStorage.setItem("adminAccessToken", accessToken);
  localStorage.setItem("adminUser", JSON.stringify(user));
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminAccessToken");
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("adminUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminUser");
}

export function isAdminUser(user: AdminUser | null | undefined) {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}
