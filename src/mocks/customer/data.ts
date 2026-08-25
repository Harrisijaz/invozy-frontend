import type { BusinessInfo, Expense, Invoice, Quotation, Usage, UserProfile } from "@/src/types/customer";

export const mockUser: UserProfile = {
  id: "usr_preview",
  name: "Avery Johnson",
  email: "avery@northstar.example",
  plan: "FREE",
};

export const mockUsage: Usage = {
  invoicesUsedLifetime: 3,
  aiUsedLifetime: 1,
  expensesUsedThisMonth: 7,
};

export const mockBusiness: BusinessInfo = {
  name: "Northstar Studio",
  email: "finance@northstar.example",
  phone: "+1 555 0148",
  address: "201 Market Street, San Francisco, CA",
  website: "northstar.example",
  currency: "USD",
  defaultTaxRate: 10,
};

export const mockInvoices: Invoice[] = [
  {
    id: "inv_1001",
    number: "INV-1001",
    client: { name: "ABC Company", email: "billing@abc.example", address: "18 Pine Avenue" },
    issueDate: "2026-08-02",
    dueDate: "2026-08-16",
    amount: 500,
    currency: "USD",
    status: "PAID",
    notes: "Thank you for your business.",
    items: [{ id: "li_1", description: "Website maintenance", quantity: 10, unitPrice: 50, taxRate: 0 }],
  },
  {
    id: "inv_1002",
    number: "INV-1002",
    client: { name: "Atlas Legal", email: "ops@atlas.example" },
    issueDate: "2026-08-08",
    dueDate: "2026-08-24",
    amount: 1150,
    currency: "USD",
    status: "UNPAID",
    items: [{ id: "li_2", description: "Consulting retainer", quantity: 23, unitPrice: 50, taxRate: 0 }],
  },
  {
    id: "inv_1003",
    number: "INV-1003",
    client: { name: "Finch Labs", email: "ap@finch.example" },
    issueDate: "2026-08-15",
    dueDate: "2026-08-30",
    amount: 2400,
    currency: "USD",
    status: "DRAFT",
    items: [{ id: "li_3", description: "Product design sprint", quantity: 4, unitPrice: 600, taxRate: 0 }],
  },
  {
    id: "inv_1004",
    number: "INV-1004",
    client: { name: "Bluebird Retail", email: "accounts@bluebird.example" },
    issueDate: "2026-07-20",
    dueDate: "2026-08-03",
    amount: 890,
    currency: "USD",
    status: "OVERDUE",
    items: [{ id: "li_4", description: "Landing page updates", quantity: 1, unitPrice: 890, taxRate: 0 }],
  },
];

export const mockQuotations: Quotation[] = [
  {
    id: "quo_2041",
    number: "QUO-2041",
    client: { name: "Finch Labs", email: "ap@finch.example" },
    issueDate: "2026-08-17",
    validUntil: "2026-09-16",
    amount: 6800,
    currency: "USD",
    status: "ACCEPTED",
    items: [{ id: "qli_1", description: "Analytics dashboard redesign", quantity: 1, unitPrice: 6800, taxRate: 10 }],
  },
  {
    id: "quo_2042",
    number: "QUO-2042",
    client: { name: "Harbor Health", email: "ops@harbor.example" },
    issueDate: "2026-08-20",
    validUntil: "2026-09-19",
    amount: 3200,
    currency: "USD",
    status: "SENT",
    items: [{ id: "qli_2", description: "Billing portal UX review", quantity: 1, unitPrice: 3200, taxRate: 0 }],
  },
];

export const mockExpenses: Expense[] = [
  { id: "exp_1", amount: 120, currency: "USD", category: "Software", date: "2026-08-04", note: "Design tool subscription" },
  { id: "exp_2", amount: 75, currency: "USD", category: "Travel", date: "2026-08-09", note: "Client meeting transport" },
  { id: "exp_3", amount: 210, currency: "USD", category: "Marketing", date: "2026-08-13", note: "Newsletter sponsorship" },
];

export const incomeExpenseSeries = [
  { month: "Mar", income: 8200, expenses: 2600 },
  { month: "Apr", income: 9600, expenses: 3100 },
  { month: "May", income: 9100, expenses: 2800 },
  { month: "Jun", income: 11200, expenses: 3600 },
  { month: "Jul", income: 10800, expenses: 3300 },
  { month: "Aug", income: 12840, expenses: 3920 },
];

export const invoiceStatusSeries = [
  { name: "Paid", value: 24 },
  { name: "Unpaid", value: 8 },
  { name: "Draft", value: 3 },
  { name: "Overdue", value: 2 },
];
