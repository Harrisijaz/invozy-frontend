"use client";

import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("invozy_admin_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("invozy_admin_token");
      localStorage.removeItem("invozy_admin");
      window.dispatchEvent(new CustomEvent("invozy-session-expired"));
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 403) return "You don't have permission to access this area.";
    if (error.response?.status === 401) return "Your session has expired. Please log in again.";
    return error.response?.data?.message ?? error.message;
  }
  return "Something went wrong";
}
