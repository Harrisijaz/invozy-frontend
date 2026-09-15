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

export interface BillingUser {
  id: string;
  name: string;
  email: string;
  accountStatus: string;
}

export interface BillingSubscription {
  id: string;
  userId: string;
  planType: string;
  status: string;
  startDate: string;
  renewalDate: string;
  cancelledAt: string | null;
  gatewayReference: string;
  manualOverride: boolean;
  manualOverrideReason: string | null;
  manualOverrideAt: string | null;
  superseded: boolean;
}

export interface BillingPayment {
  id: string;
  userId: string;
  amount: number;
  status: string;
  gatewayReference: string;
  createdAt: string;
  retryOrExpiryDate: string;
  refundedAt: string | null;
  refundedAmount: number | null;
  refundNote: string | null;
}

export interface BillingSubscriptionRow {
  id: string;
  subscription: BillingSubscription;
  user: BillingUser | null;
  userDisplay: string;
  userEmail: string;
  userSearch: string;
}

export interface BillingPaymentIssueRow {
  id: string;
  payment: BillingPayment;
  user: BillingUser | null;
  userDisplay: string;
  userEmail: string;
  userSearch: string;
}

export interface BillingOverview {
  subscriptions: BillingSubscriptionRow[];
  failedOrPendingPayments: BillingPaymentIssueRow[];
}
