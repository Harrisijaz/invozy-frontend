export interface ActivityLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  result: string;
  raw: unknown;
}
