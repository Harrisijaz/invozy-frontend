export type PlanCode = "FREE" | "PAID";
export type InvoiceStatus = "DRAFT" | "UNPAID" | "PAID" | "OVERDUE" | "DELETED";
export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "EXPIRED" | "CONVERTED";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: PlanCode;
};

export type Usage = {
  invoicesUsedLifetime: number;
  aiUsedLifetime: number;
  expensesUsedThisMonth: number;
};

export type ClientInfo = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
};

export type BusinessInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  currency: string;
  defaultTaxRate: number;
};

export type Invoice = {
  id: string;
  number: string;
  client: ClientInfo;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  items: LineItem[];
  notes?: string;
};

export type Quotation = Omit<Invoice, "status" | "dueDate"> & {
  status: QuotationStatus;
  validUntil: string;
};

export type Expense = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  note: string;
};
