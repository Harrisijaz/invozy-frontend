import type { Expense, InternalNote, Invoice, User } from "@/types";

export const users: User[] = [
  { id: "usr_1001", name: "Avery Johnson", email: "avery@northstar.co", plan: "Business", status: "Active", signupDate: "2026-01-08", revenue: 4280, avatar: "AJ", invoices: 184, expenses: 92, payments: 24 },
  { id: "usr_1002", name: "Mina Patel", email: "mina@ledgerly.io", plan: "Pro", status: "Active", signupDate: "2026-02-14", revenue: 1290, avatar: "MP", invoices: 71, expenses: 38, payments: 9 },
  { id: "usr_1003", name: "Chris Morgan", email: "chris@pilotops.com", plan: "Free", status: "Trial", signupDate: "2026-07-20", revenue: 0, avatar: "CM", invoices: 8, expenses: 3, payments: 0 },
  { id: "usr_1004", name: "Sara Lee", email: "sara@arcstudio.dev", plan: "Starter", status: "Blocked", signupDate: "2025-11-17", revenue: 540, avatar: "SL", invoices: 32, expenses: 19, payments: 6 },
  { id: "usr_1005", name: "Daniel Kim", email: "daniel@brightbook.ai", plan: "Business", status: "Active", signupDate: "2025-09-03", revenue: 6890, avatar: "DK", invoices: 245, expenses: 111, payments: 31 },
  { id: "usr_1006", name: "Nora Smith", email: "nora@clearcash.com", plan: "Pro", status: "Deleted", signupDate: "2025-08-26", revenue: 910, avatar: "NS", invoices: 48, expenses: 26, payments: 7 },
  { id: "usr_1007", name: "Omar Farooq", email: "omar@finwave.pk", plan: "Starter", status: "Active", signupDate: "2026-04-12", revenue: 410, avatar: "OF", invoices: 24, expenses: 12, payments: 4 },
  { id: "usr_1008", name: "Elena Cruz", email: "elena@solace.agency", plan: "Free", status: "Active", signupDate: "2026-08-02", revenue: 0, avatar: "EC", invoices: 5, expenses: 2, payments: 0 },
];

export const invoices: Invoice[] = [
  { id: "inv_1", invoiceNumber: "INV-2026-1082", amount: 980, status: "Paid", issueDate: "2026-08-02", dueDate: "2026-08-16" },
  { id: "inv_2", invoiceNumber: "INV-2026-1083", amount: 420, status: "Pending", issueDate: "2026-08-07", dueDate: "2026-08-21" },
  { id: "inv_3", invoiceNumber: "INV-2026-1084", amount: 1240, status: "Overdue", issueDate: "2026-07-19", dueDate: "2026-08-02" },
];

export const expenses: Expense[] = [
  { id: "exp_1", expense: "Cloud storage", amount: 84, category: "Software", date: "2026-08-03", status: "Approved" },
  { id: "exp_2", expense: "Team lunch", amount: 210, category: "Meals", date: "2026-08-08", status: "Pending" },
  { id: "exp_3", expense: "Client travel", amount: 640, category: "Travel", date: "2026-07-28", status: "Rejected" },
];

export const internalNotes: InternalNote[] = [
  { id: "note_1", note: "Customer contacted support regarding an invoice issue.", admin: "Haris", createdAt: "2026-08-20T10:20:00.000Z" },
  { id: "note_2", note: "Internal - Admins Only: verified billing contact before subscription change.", admin: "Ayesha", createdAt: "2026-08-18T13:45:00.000Z" },
];
