export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  admin: Admin;
}

export interface ActivityLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  result: "Success" | "Failed" | "Warning";
}
