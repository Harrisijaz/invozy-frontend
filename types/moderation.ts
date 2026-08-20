export interface ModerationFlag {
  id: string;
  user: string;
  reason: string;
  riskLevel: "High" | "Medium" | "Low";
  detectedAt: string;
  status: "Open" | "Resolved" | "Dismissed";
}
