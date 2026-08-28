import { customerApi } from "@/src/lib/customer/api";
import { clearUserSession, getUserRefreshToken, storeUserSession } from "@/lib/auth";
import type { AuthMessageResponse, LoginResponse, RefreshResponse, SignupRequest, VerifyEmailRequest } from "@/src/types/customer";

export const USER_ACCESS_TOKEN_KEY = "invozy_user_access_token";
export const USER_AUTH_COOKIE = "invozy_user_token";

export const authService = {
  async signup(payload: SignupRequest) {
    const response = await customerApi.post<AuthMessageResponse>("/auth/signup", payload);
    return response.data;
  },
  async verifyEmail(payload: VerifyEmailRequest) {
    const response = await customerApi.post<AuthMessageResponse>("/auth/verify-email", payload);
    return response.data;
  },
  async resendVerification(email: string) {
    const response = await customerApi.post<AuthMessageResponse>("/auth/resend-verification", { email });
    return response.data;
  },
  async login(payload: { email: string; password: string }) {
    const response = await customerApi.post<LoginResponse>("/auth/login", payload);
    storeUserSession(response.data.accessToken, response.data.refreshToken, response.data.userInfo);
    return response.data;
  },
  async refresh(refreshToken: string) {
    const response = await customerApi.post<RefreshResponse>("/auth/refresh", { refreshToken });
    storeUserSession(response.data.accessToken, response.data.refreshToken, response.data.userInfo);
    return response.data;
  },
  async forgotPassword(email: string) {
    const response = await customerApi.post<AuthMessageResponse>("/auth/forgot-password", { email });
    return response.data;
  },
  async resetPassword(payload: { token: string; newPassword: string }) {
    const response = await customerApi.post<AuthMessageResponse>("/auth/reset-password", payload);
    return response.data;
  },
  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    const response = await customerApi.post<AuthMessageResponse>("/auth/change-password", payload);
    return response.data;
  },
  async logout() {
    const refreshToken = getUserRefreshToken();
    try {
      await customerApi.post("/auth/logout", { refreshToken });
    } finally {
      clearUserSession();
    }
  },
  async logoutAll() {
    try {
      await customerApi.post("/auth/logout-all");
    } finally {
      clearUserSession();
    }
  },
};
