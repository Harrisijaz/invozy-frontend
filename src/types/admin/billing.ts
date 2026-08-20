export interface UserSubscriptionsView {
  currentPlan: string;
  status: string;
  startDate: string;
  renewalDate: string;
  cancellationInformation: string;
  history: Record<string, unknown>[];
  raw: unknown;
}

export interface ChangePlanRequest {
  plan: "FREE" | "PAID";
  reason: string;
}

export interface FailedPendingPayment {
  id: string;
  paymentId: string;
  transactionId: string;
  user: string;
  userId?: string;
  amount: number;
  plan: string;
  paymentMethod: string;
  status: string;
  date: string;
  raw: unknown;
}

export interface RefundPaymentRequest {
  amount: number;
  note: string;
}
