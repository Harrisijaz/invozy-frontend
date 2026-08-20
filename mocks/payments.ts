import type { Payment, Refund } from "@/types";

export const payments: Payment[] = [
  { id: "pay_1", transactionId: "txn_9A28FD", user: "Avery Johnson", amount: 499, plan: "Business", paymentMethod: "Visa ending 4242", status: "Successful", date: "2026-08-08" },
  { id: "pay_2", transactionId: "txn_8C19BB", user: "Mina Patel", amount: 129, plan: "Pro", paymentMethod: "Mastercard ending 1881", status: "Successful", date: "2026-08-14" },
  { id: "pay_3", transactionId: "txn_7D21EA", user: "Sara Lee", amount: 49, plan: "Starter", paymentMethod: "Visa ending 9012", status: "Failed", date: "2026-08-17" },
  { id: "pay_4", transactionId: "txn_6F34DC", user: "Nora Smith", amount: 129, plan: "Pro", paymentMethod: "Amex ending 0005", status: "Refunded", date: "2026-07-26" },
  { id: "pay_5", transactionId: "txn_5H56LK", user: "Daniel Kim", amount: 499, plan: "Business", paymentMethod: "Bank debit", status: "Pending", date: "2026-08-19" },
];

export const refunds: Refund[] = [
  { id: "ref_1", transactionId: "txn_6F34DC", status: "Refund Completed", amount: 129 },
  { id: "ref_2", transactionId: "txn_3Q11XS", status: "Refund Requested", amount: 49 },
  { id: "ref_3", transactionId: "txn_1Z88MN", status: "Refund Failed", amount: 129 },
];
