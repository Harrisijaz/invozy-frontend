"use client";

import axios, { AxiosError } from "axios";
import { ADMIN_ACCESS_TOKEN_KEY, clearAdminSession } from "@/lib/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      clearAdminSession();
      window.dispatchEvent(new CustomEvent("invozy-session-expired"));
    }

    return Promise.reject(error);
  },
);

function readableErrorValue(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    const messages = value.map(readableErrorValue).filter(Boolean);
    return messages.length ? messages.join(", ") : null;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      readableErrorValue(record.message) ??
      readableErrorValue(record.error) ??
      readableErrorValue(record.detail) ??
      readableErrorValue(record.code)
    );
  }

  return null;
}

export function getApiErrorMessage(error: unknown, fallback = "Unable to complete the request. Please try again.") {
  if (!axios.isAxiosError(error)) return fallback;

  if (!error.response) return "Network error. Please check your connection and try again.";

  const message = readableErrorValue(error.response.data);
  if (message) return message;

  switch (error.response.status) {
    case 400:
      return "The request could not be processed.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to access this area.";
    case 404:
      return "The requested information was not found.";
    case 409:
      return "This action conflicts with the current backend state.";
    case 422:
      return "Some fields need correction before this can be saved.";
    case 500:
      return "The server could not complete this request.";
    case 503:
      return "The service is temporarily unavailable.";
    default:
      return fallback;
  }
}
