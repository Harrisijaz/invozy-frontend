export type PlanCode = "FREE" | "PAID";
export type InvoiceStatus = "DRAFT" | "UNPAID" | "PAYMENT_PROCESSING" | "PAID" | "DELETED";
export type QuotationStatus = "PENDING" | "CONVERTED" | "EXPIRED";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAYMENT_FAILED" | "GRACE_PERIOD";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: PlanCode;
};

export type UserInfo = {
  userId: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | string;
  status: string;
  emailVerified: boolean;
};

export type Usage = {
  invoicesUsedLifetime: number;
  aiUsedLifetime: number;
  expensesUsedThisMonth: number;
  freeInvoiceLimit?: number;
  freeAiLimit?: number;
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
  activePaymentLink?: string;
  createdVia?: "MANUAL" | "AI";
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

export type ApiErrorBody = {
  code?: string;
  message?: string;
  timestamp?: string;
  fields?: Record<string, string>;
};

export type SignupRequest = {
  email: string;
  password: string;
  fullName: string;
  termsAccepted: boolean;
};

export type AuthMessageResponse = {
  message: string;
  devToken?: string | null;
};

export type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  emailVerified: boolean;
  userInfo: UserInfo;
};

export type RefreshResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfo;
};

export type VerifyEmailRequest = {
  email: string;
  code: string;
};

export type Profile = {
  userId: string;
  displayName: string;
  email: string;
  profilePictureUrl?: string | null;
  createdAt: string;
};

export type ProfilePictureUploadUrl = {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
  method: "PUT";
  expiresAt: string;
};

export type LegacyVerify2FaResponse = {
  message: string;
  accessToken: string;
  refreshToken?: string;
  emailVerified: boolean;
  userInfo: UserInfo;
};

export type Subscription = {
  planType: PlanCode;
  status: SubscriptionStatus;
  renewalDate: string | null;
  downgradeScheduled: boolean;
  lifetimeInvoiceCount: number;
  freeInvoiceLimit: number;
  lifetimeAiGenerationCount: number;
  freeAiLimit: number;
};

export type InvoiceLineItemRequest = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export type InvoiceRequest = {
  clientName: string;
  clientEmail: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: InvoiceLineItemRequest[];
  taxRate: number;
  currency: string;
  internalNotes?: string;
};

export type InvoiceResponse = Omit<InvoiceRequest, "lineItems"> & {
  id: number;
  invoiceNumber: string;
  lineItems: Array<InvoiceLineItemRequest & { lineTotalCents: number }>;
  subtotalCents: number;
  taxAmountCents: number;
  totalCents: number;
  status: InvoiceStatus;
  createdVia: "MANUAL" | "AI";
  activePaymentLink?: string;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type InvoiceFilters = {
  page?: number;
  size?: number;
  status?: InvoiceStatus | "ALL";
  clientName?: string;
  fromDate?: string;
  toDate?: string;
};

export type AiInvoiceDraft = {
  clientName?: string;
  clientEmail?: string;
  lineItems?: InvoiceLineItemRequest[];
  taxRate?: number;
  currency?: string;
  message?: string;
};

export type QuotationRequest = {
  clientName: string;
  clientEmail: string;
  quotationDate: string;
  validUntil: string;
  lineItems: InvoiceLineItemRequest[];
  taxRate: number;
  currency: string;
};

export type QuotationResponse = Omit<QuotationRequest, "lineItems"> & {
  id: number;
  quotationNumber?: string;
  lineItems: Array<InvoiceLineItemRequest & { lineTotalCents?: number }>;
  subtotalCents?: number;
  taxAmountCents?: number;
  totalCents?: number;
  status: QuotationStatus;
};

export type ExpenseRequest = {
  amountCents: number;
  category: string;
  expenseDate: string;
  note?: string;
};

export type ExpenseResponse = ExpenseRequest & {
  id: number;
};

export type FinanceSummary = {
  fromDate: string;
  toDate: string;
  incomeCents: number;
  expensesCents: number;
  savingsCents: number;
};

export type SettingsResponse = {
  baseCurrency: string;
  defaultTaxRate: number;
  businessName: string;
  logoUrl: string;
};
