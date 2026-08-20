"use client";

import type { Admin, AuthSession } from "@/types";

const TOKEN_KEY = "invozy_admin_token";
const ADMIN_KEY = "invozy_admin";

export function persistSession(session: AuthSession) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(session.admin));
}

export function getStoredAdmin(): Admin | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Admin;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function isAdminRole(role?: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}
