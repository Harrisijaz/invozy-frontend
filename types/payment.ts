import type { UserPlan } from "./user";

export interface Payment {
  id: string;
  transactionId: string;
  user: string;
  amount: number;
  plan: UserPlan;
  paymentMethod: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded";
  date: string;
}

export interface Refund {
  id: string;
  transactionId: string;
  status: "Refund Requested" | "Refund Completed" | "Refund Failed";
  amount: number;
}
