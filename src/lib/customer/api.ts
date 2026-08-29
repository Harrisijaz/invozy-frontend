"use client";

import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { clearUserSession, getUserRefreshToken, getUserToken, storeUserSession } from "@/lib/auth";
import type { ApiErrorBody, RefreshResponse } from "@/src/types/customer";

export const CUSTOMER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const customerApi = axios.create({
  baseURL: CUSTOMER_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let refreshRequest: Promise<RefreshResponse> | null = null;

customerApi.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = getUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

customerApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const isTokenExpired = error.response?.status === 401 && error.response.data?.code === "TOKEN_EXPIRED";

    if (typeof window !== "undefined" && isTokenExpired && originalRequest && !originalRequest._retry) {
      const refreshToken = getUserRefreshToken();
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          refreshRequest ??= axios
            .post<RefreshResponse>(
              `${CUSTOMER_API_BASE_URL}/auth/refresh`,
              { refreshToken },
              { headers: { "Content-Type": "application/json" } },
            )
            .then((response) => response.data)
            .finally(() => {
              refreshRequest = null;
            });
          const refreshed = await refreshRequest;
          storeUserSession(refreshed.accessToken, refreshed.refreshToken, refreshed.userInfo);
          originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
          return customerApi(originalRequest);
        } catch {
          clearUserSession();
          window.dispatchEvent(new CustomEvent("invozy-user-session-expired"));
        }
      }
    }

    if (typeof window !== "undefined" && error.response?.status === 401) {
      clearUserSession();
      window.dispatchEvent(new CustomEvent("invozy-user-session-expired"));
    }
    return Promise.reject(error);
  },
);

function readableErrorValue(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(readableErrorValue).filter(Boolean).join(", ") || null;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const fieldMessages = record.fields && typeof record.fields === "object" ? Object.values(record.fields as Record<string, unknown>).map(readableErrorValue).filter(Boolean).join(", ") : null;
    return readableErrorValue(record.message) ?? fieldMessages ?? readableErrorValue(record.error) ?? readableErrorValue(record.detail) ?? readableErrorValue(record.code);
  }
  return null;
}

export function getCustomerApiErrorMessage(error: unknown, fallback = "Unable to complete the request. Please try again.") {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "Network error. Please check the gateway and try again.";
  const message = readableErrorValue(error.response.data);
  if (message) return message;
  if (error.response.status === 401) return "Your session has expired. Please log in again.";
  if (error.response.status === 422 || error.response.status === 400) return "Some fields need correction before this can be saved.";
  return fallback;
}

export function getCustomerApiErrorCode(error: unknown) {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return null;
  return error.response?.data?.code ?? null;
}
