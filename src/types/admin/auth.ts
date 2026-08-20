export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN" | string;
  status: string;
  emailVerified: boolean;
}

export interface AdminLoginResponse {
  message: string;
  accessToken: string;
  emailVerified: boolean;
  userInfo: AdminUser;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}
