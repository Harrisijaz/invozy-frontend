import type { ModerationFlag } from "@/types";

export const moderationFlags: ModerationFlag[] = [
  { id: "flag_1", user: "sara@arcstudio.dev", reason: "Repeated failed payment attempts with mismatched billing identity", riskLevel: "High", detectedAt: "2026-08-20T08:32:00.000Z", status: "Open" },
  { id: "flag_2", user: "chris@pilotops.com", reason: "High invoice volume from a new trial workspace", riskLevel: "Medium", detectedAt: "2026-08-19T16:10:00.000Z", status: "Open" },
  { id: "flag_3", user: "elena@solace.agency", reason: "Unusual login geography", riskLevel: "Low", detectedAt: "2026-08-18T11:02:00.000Z", status: "Dismissed" },
  { id: "flag_4", user: "nora@clearcash.com", reason: "Chargeback pattern detected", riskLevel: "High", detectedAt: "2026-08-17T14:55:00.000Z", status: "Resolved" },
];
