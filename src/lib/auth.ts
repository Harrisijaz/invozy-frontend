"use client";

import type { AdminUser } from "@/types/admin/auth";

export const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";
export const ADMIN_USER_KEY = "adminUser";
export const ADMIN_AUTH_COOKIE = "invozy_admin_token";

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function setAdminAuthCookie(accessToken: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_AUTH_COOKIE}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${ADMIN_SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearAdminAuthCookie() {
  document.cookie = `${ADMIN_AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function storeAdminSession(accessToken: string, user: AdminUser) {
  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  setAdminAuthCookie(accessToken);
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  clearAdminAuthCookie();
}

export function isAdminUser(user: AdminUser | null | undefined) {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}
