import { api } from "@/lib/api";
import { asRecord, boolValue, numberValue, pickArray, pickRecord, text } from "@/lib/normalize";
import type {
  BillingOverview,
  BillingPaymentIssueRow,
  BillingSubscription,
  BillingSubscriptionRow,
  BillingUser,
  ChangePlanRequest,
  FailedPendingPayment,
  RefundPaymentRequest,
  UserSubscriptionsView,
} from "@/types/admin/billing";

function payment(value: unknown, index: number): FailedPendingPayment {
  const record = asRecord(value);
  return {
    id: text(record, ["id", "paymentId"], `payment-${index}`),
    paymentId: text(record, ["paymentId", "id"], `payment-${index}`),
    transactionId: text(record, ["transactionId", "gatewayReference", "reference"], ""),
    user: text(record, ["user", "userName", "email", "userEmail"], "Unknown user"),
    userId: text(record, ["userId"], ""),
    amount: numberValue(record, ["amount", "total"]),
    plan: text(record, ["plan"], "UNKNOWN"),
    paymentMethod: text(record, ["paymentMethod", "method"], ""),
    status: text(record, ["status"], "UNKNOWN"),
    date: text(record, ["date", "createdAt", "paidAt"], ""),
    raw: value,
  };
}

function nullableText(record: Record<string, unknown>, keys: string[]) {
  const value = text(record, keys, "");
  return value || null;
}

function billingUser(value: unknown): BillingUser | null {
  const record = asRecord(value);
  const id = text(record, ["id", "userId"], "");
  const name = text(record, ["name", "fullName"], "");
  const email = text(record, ["email"], "");
  const accountStatus = text(record, ["accountStatus", "status"], "UNKNOWN");

  if (!id && !name && !email) return null;

  return { id, name, email, accountStatus };
}

function subscription(value: unknown, index: number): BillingSubscriptionRow {
  const wrapper = asRecord(value);
  const record = asRecord(wrapper.subscription ?? value);
  const user = billingUser(wrapper.user);
  const userId = text(record, ["userId"], user?.id ?? "");
  const userDisplay = user?.name || user?.email || userId || "Unknown user";
  const userEmail = user?.email ?? "";

  return {
    id: text(record, ["id", "subscriptionId"], `subscription-${index}`),
    subscription: {
      id: text(record, ["id", "subscriptionId"], `subscription-${index}`),
      userId,
      planType: text(record, ["planType", "plan"], "UNKNOWN"),
      status: text(record, ["status"], "UNKNOWN"),
      startDate: text(record, ["startDate", "startedAt"], ""),
      renewalDate: text(record, ["renewalDate", "renewsAt", "nextBillingDate"], ""),
      cancelledAt: nullableText(record, ["cancelledAt", "cancellationDate"]),
      gatewayReference: text(record, ["gatewayReference", "transactionId", "reference"], ""),
      manualOverride: boolValue(record, ["manualOverride"]),
      manualOverrideReason: nullableText(record, ["manualOverrideReason"]),
      manualOverrideAt: nullableText(record, ["manualOverrideAt"]),
      superseded: boolValue(record, ["superseded"]),
    },
    user,
    userDisplay,
    userEmail,
    userSearch: [userDisplay, userEmail, userId].filter(Boolean).join(" "),
  };
}

function billingPayment(value: unknown, index: number): BillingPaymentIssueRow {
  const wrapper = asRecord(value);
  const record = asRecord(wrapper.payment ?? value);
  const user = billingUser(wrapper.user);
  const userId = text(record, ["userId"], user?.id ?? "");
  const userDisplay = user?.name || user?.email || userId || "Unknown user";
  const userEmail = user?.email ?? "";

  return {
    id: text(record, ["id", "paymentId"], `payment-${index}`),
    payment: {
      id: text(record, ["id", "paymentId"], `payment-${index}`),
      userId,
      amount: numberValue(record, ["amount", "total"]),
      status: text(record, ["status"], "UNKNOWN"),
      gatewayReference: text(record, ["gatewayReference", "transactionId", "reference"], ""),
      createdAt: text(record, ["createdAt", "date", "paidAt"], ""),
      retryOrExpiryDate: text(record, ["retryOrExpiryDate", "expiresAt", "retryAt"], ""),
      refundedAt: nullableText(record, ["refundedAt"]),
      refundedAmount: record.refundedAmount === undefined || record.refundedAmount === null ? null : numberValue(record, ["refundedAmount"], 0),
      refundNote: nullableText(record, ["refundNote"]),
    },
    user,
    userDisplay,
    userEmail,
    userSearch: [userDisplay, userEmail, userId].filter(Boolean).join(" "),
  };
}

function overview(value: unknown): BillingOverview {
  return {
    subscriptions: pickArray(value, ["subscriptions"]).map(subscription),
    failedOrPendingPayments: pickArray(value, ["failedOrPendingPayments", "payments", "items"]).map(billingPayment),
  };
}

export const billingService = {
  async getBillingOverview(): Promise<BillingOverview> {
    const { data } = await api.get<unknown>("/admin/billing/overview");
    return overview(data);
  },

  async reconcileUserSubscription(userId: string): Promise<BillingOverview> {
    const { data } = await api.post<unknown>(`/admin/billing/users/${encodeURIComponent(userId)}/reconcile`);
    return overview(data);
  },

  async getPaidSubscriptionsOnly(): Promise<BillingSubscription[]> {
    const { data } = await api.get<unknown>("/admin/billing/subscriptions");
    return pickArray(data, ["subscriptions", "data", "items"]).map((item, index) => subscription(item, index).subscription);
  },

  async getUserSubscriptions(userId: string): Promise<UserSubscriptionsView> {
    const { data } = await api.get<unknown>(`/admin/billing/users/${userId}/subscriptions`);
    const current = pickRecord(data, ["current", "subscription", "currentSubscription"]);
    return {
      currentPlan: text(current, ["plan", "currentPlan"], "UNKNOWN"),
      status: text(current, ["status", "subscriptionStatus"], "UNKNOWN"),
      startDate: text(current, ["startDate", "startedAt"], ""),
      renewalDate: text(current, ["renewalDate", "renewsAt", "nextBillingDate"], ""),
      cancellationInformation: text(current, ["cancellationDate", "cancelledAt", "cancellationInformation"], "Not scheduled"),
      history: pickArray(data, ["history", "subscriptionHistory"]),
      raw: data,
    };
  },

  async changeUserPlan(userId: string, body: ChangePlanRequest) {
    const { data } = await api.post<unknown>(`/admin/billing/users/${userId}/plan`, body);
    return data;
  },

  async getFailedPendingPayments() {
    const { data } = await api.get<unknown>("/admin/billing/payments/failed-pending");
    return pickArray(data, ["payments", "data", "items", "failedPendingPayments"]).map(payment);
  },

  async refundPayment(paymentId: string, body: RefundPaymentRequest) {
    const { data } = await api.post<unknown>(`/admin/billing/payments/${paymentId}/refund`, body);
    return data;
  },
};
