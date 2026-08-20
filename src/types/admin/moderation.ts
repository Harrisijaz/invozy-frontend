export interface ModerationFlag {
  id: string;
  flagId: string;
  userId: string;
  user: string;
  reason: string;
  riskLevel: string;
  detectedAt: string;
  status: string;
  raw: unknown;
}

export interface DismissFlagRequest {
  note: string;
}
