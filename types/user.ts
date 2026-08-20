export type UserPlan = "Free" | "Starter" | "Pro" | "Business";
export type UserStatus = "Active" | "Blocked" | "Deleted" | "Trial";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  status: UserStatus;
  signupDate: string;
  revenue: number;
  avatar: string;
  invoices: number;
  expenses: number;
  payments: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Draft";
  issueDate: string;
  dueDate: string;
}

export interface Expense {
  id: string;
  expense: string;
  amount: number;
  category: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface InternalNote {
  id: string;
  note: string;
  admin: string;
  createdAt: string;
}
