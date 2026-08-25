import { useQuery } from "@tanstack/react-query";
import { incomeExpenseSeries, invoiceStatusSeries, mockExpenses, mockInvoices, mockQuotations, mockUsage, mockUser } from "@/src/mocks/customer/data";

export function useDashboard() {
  return useQuery({
    queryKey: ["customer", "dashboard"],
    queryFn: async () => ({
      user: mockUser,
      usage: mockUsage,
      invoices: mockInvoices,
      quotations: mockQuotations,
      expenses: mockExpenses,
      incomeExpenseSeries,
      invoiceStatusSeries,
    }),
  });
}
