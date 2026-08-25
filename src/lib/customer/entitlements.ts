import type { PlanCode, Usage } from "@/src/types/customer";

export const planRules = {
  FREE: {
    invoiceLimit: 5,
    aiLimit: 2,
    expenseLimit: 10,
    invoiceScope: "lifetime",
    aiScope: "lifetime",
    expenseScope: "this month",
    paymentLinks: false,
    incomeDashboard: false,
    financialReports: false,
  },
  PAID: {
    invoiceLimit: null,
    aiLimit: null,
    expenseLimit: null,
    invoiceScope: "unlimited",
    aiScope: "unlimited",
    expenseScope: "unlimited",
    paymentLinks: true,
    incomeDashboard: true,
    financialReports: true,
  },
} as const;

export function getEntitlements(plan: PlanCode, usage: Usage) {
  const rules = planRules[plan];
  return {
    canCreateInvoice: rules.invoiceLimit === null || usage.invoicesUsedLifetime < rules.invoiceLimit,
    canUseAI: rules.aiLimit === null || usage.aiUsedLifetime < rules.aiLimit,
    canTrackExpenses: rules.expenseLimit === null || usage.expensesUsedThisMonth < rules.expenseLimit,
    canGeneratePaymentLink: rules.paymentLinks,
    canViewIncome: rules.incomeDashboard,
    canExportReports: rules.financialReports,
    rules,
  };
}
