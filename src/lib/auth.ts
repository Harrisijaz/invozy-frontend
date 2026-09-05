"use client";

import type { AdminUser } from "@/types/admin/auth";
import type { UserInfo } from "@/src/types/customer";

export const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";
export const ADMIN_USER_KEY = "adminUser";
export const ADMIN_AUTH_COOKIE = "invorights_admin_token";
export const USER_ACCESS_TOKEN_KEY = "invorights_user_access_token";
export const USER_REFRESH_TOKEN_KEY = "invorights_user_refresh_token";
export const USER_INFO_KEY = "invorights_user_info";
export const USER_AUTH_COOKIE = "invorights_user_token";

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const USER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

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

function setUserAuthCookie(accessToken: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${USER_AUTH_COOKIE}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${USER_SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearUserAuthCookie() {
  document.cookie = `${USER_AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function storeUserSession(accessToken: string, refreshToken: string, user: UserInfo) {
  localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  setUserAuthCookie(accessToken);
}

export function getUserToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ACCESS_TOKEN_KEY);
}

export function getUserRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_REFRESH_TOKEN_KEY);
}

export function getStoredUserInfo(): UserInfo | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

export function clearUserSession() {
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  clearUserAuthCookie();
}
