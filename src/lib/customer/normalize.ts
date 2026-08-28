import type {
  Expense,
  ExpenseResponse,
  FinanceSummary,
  Invoice,
  InvoiceRequest,
  InvoiceResponse,
  LineItem,
  Quotation,
  QuotationRequest,
  QuotationResponse,
  SettingsResponse,
  Subscription,
  Usage,
  UserInfo,
  UserProfile,
} from "@/src/types/customer";

export function centsToAmount(value?: number | null) {
  return (value ?? 0) / 100;
}

export function amountToCents(value: number) {
  return Math.round(value * 100);
}

function normalizeLineItems(items: InvoiceResponse["lineItems"] | QuotationResponse["lineItems"], taxRate: number): LineItem[] {
  return items.map((item, index) => ({
    id: String(index),
    description: item.description,
    quantity: item.quantity,
    unitPrice: centsToAmount(item.unitPriceCents),
    taxRate,
  }));
}

export function normalizeInvoice(invoice: InvoiceResponse): Invoice {
  return {
    id: String(invoice.id),
    number: invoice.invoiceNumber,
    client: { name: invoice.clientName, email: invoice.clientEmail },
    issueDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    amount: centsToAmount(invoice.totalCents),
    currency: invoice.currency,
    status: invoice.status,
    items: normalizeLineItems(invoice.lineItems, invoice.taxRate),
    notes: invoice.internalNotes,
    activePaymentLink: invoice.activePaymentLink,
    createdVia: invoice.createdVia,
  };
}

export function normalizeQuotation(quotation: QuotationResponse): Quotation {
  const total = quotation.totalCents ?? quotation.lineItems.reduce((sum, item) => sum + (item.lineTotalCents ?? item.quantity * item.unitPriceCents), 0);
  return {
    id: String(quotation.id),
    number: quotation.quotationNumber ?? `QUO-${quotation.id}`,
    client: { name: quotation.clientName, email: quotation.clientEmail },
    issueDate: quotation.quotationDate,
    validUntil: quotation.validUntil,
    amount: centsToAmount(total),
    currency: quotation.currency,
    status: quotation.status,
    items: normalizeLineItems(quotation.lineItems, quotation.taxRate),
  };
}

export function normalizeExpense(expense: ExpenseResponse, currency = "USD"): Expense {
  return {
    id: String(expense.id),
    amount: centsToAmount(expense.amountCents),
    currency,
    category: expense.category,
    date: expense.expenseDate,
    note: expense.note ?? "",
  };
}

export function invoiceToRequest(values: {
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  notes?: string;
  items: Array<{ description: string; quantity: number; unitPrice: number; taxRate: number }>;
}): InvoiceRequest {
  const taxRate = values.items[0]?.taxRate ?? 0;
  return {
    clientName: values.clientName,
    clientEmail: values.clientEmail,
    invoiceDate: values.issueDate,
    dueDate: values.dueDate,
    lineItems: values.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPriceCents: amountToCents(item.unitPrice),
    })),
    taxRate,
    currency: values.currency,
    internalNotes: values.notes,
  };
}

export function quotationToRequest(values: {
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  items: Array<{ description: string; quantity: number; unitPrice: number; taxRate: number }>;
}): QuotationRequest {
  const taxRate = values.items[0]?.taxRate ?? 0;
  return {
    clientName: values.clientName,
    clientEmail: values.clientEmail,
    quotationDate: values.issueDate,
    validUntil: values.dueDate,
    lineItems: values.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPriceCents: amountToCents(item.unitPrice),
    })),
    taxRate,
    currency: values.currency,
  };
}

export function subscriptionToUsage(subscription: Subscription): Usage {
  return {
    invoicesUsedLifetime: subscription.lifetimeInvoiceCount,
    aiUsedLifetime: subscription.lifetimeAiGenerationCount,
    expensesUsedThisMonth: 0,
    freeInvoiceLimit: subscription.freeInvoiceLimit,
    freeAiLimit: subscription.freeAiLimit,
  };
}

export function userInfoToProfile(user: UserInfo | null, subscription?: Subscription | null): UserProfile {
  return {
    id: user?.userId ?? "",
    name: user?.name ?? "User",
    email: user?.email ?? "",
    plan: subscription?.planType ?? "FREE",
  };
}

export function settingsToBusiness(settings?: SettingsResponse | null) {
  return {
    name: settings?.businessName ?? "Smart Invoice",
    email: "",
    phone: "",
    address: "",
    website: "",
    currency: settings?.baseCurrency ?? "USD",
    defaultTaxRate: settings?.defaultTaxRate ?? 0,
  };
}

export function summaryToCards(summary?: FinanceSummary | null) {
  return {
    income: centsToAmount(summary?.incomeCents),
    expenses: centsToAmount(summary?.expensesCents),
    savings: centsToAmount(summary?.savingsCents),
  };
}
