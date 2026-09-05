import type { ActivityLog } from "@/types";

export const activityLogs: ActivityLog[] = [
  { id: "log_1", admin: "Haris", action: "Blocked User", target: "sara@arcstudio.dev", ipAddress: "203.0.113.42", timestamp: "2026-08-20T10:31:00.000Z", result: "Success" },
  { id: "log_2", admin: "Ayesha", action: "Triggered Password Reset", target: "mina@ledgerly.io", ipAddress: "198.51.100.10", timestamp: "2026-08-20T10:11:00.000Z", result: "Success" },
  { id: "log_3", admin: "System", action: "Session Expired", target: "admin@invorights.com", ipAddress: "192.0.2.20", timestamp: "2026-08-20T09:54:00.000Z", result: "Warning" },
  { id: "log_4", admin: "Haris", action: "Refund Requested", target: "txn_3Q11XS", ipAddress: "203.0.113.42", timestamp: "2026-08-19T17:40:00.000Z", result: "Success" },
  { id: "log_5", admin: "Ayesha", action: "Plan Change Failed", target: "nora@clearcash.com", ipAddress: "198.51.100.10", timestamp: "2026-08-19T15:22:00.000Z", result: "Failed" },
];
