export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export const ROUTES = {
  login: "/admin/login",
  forgotPassword: "/admin/forgot-password",
  dashboard: "/admin/dashboard",
  users: "/admin/users",
  subscriptions: "/admin/subscriptions",
  billing: "/admin/billing",
  analytics: "/admin/analytics",
  support: "/admin/support",
  moderation: "/admin/moderation",
  aiUsage: "/admin/ai-usage",
  activityLogs: "/admin/activity-logs",
  security: "/admin/security",
} as const;
