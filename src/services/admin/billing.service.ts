import { api } from "@/lib/api";
import { asRecord, numberValue, pickArray, pickRecord, text } from "@/lib/normalize";
import type { ChangePlanRequest, FailedPendingPayment, RefundPaymentRequest, UserSubscriptionsView } from "@/types/admin/billing";

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

export const billingService = {
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
