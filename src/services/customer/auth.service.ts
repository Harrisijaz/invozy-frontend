import { integrationPending } from "./integration";

export const USER_ACCESS_TOKEN_KEY = "invozy_user_access_token";
export const USER_AUTH_COOKIE = "invozy_user_token";

export const authService = {
  login: () => integrationPending("authService.login"),
  signup: () => integrationPending("authService.signup"),
  forgotPassword: () => integrationPending("authService.forgotPassword"),
  resetPassword: () => integrationPending("authService.resetPassword"),
  logout() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
    document.cookie = `${USER_AUTH_COOKIE}=; Max-Age=0; path=/; SameSite=Lax`;
  },
};
