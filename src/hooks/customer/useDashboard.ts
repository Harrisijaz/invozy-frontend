import { useQuery } from "@tanstack/react-query";
import { getStoredUserInfo } from "@/lib/auth";
import { invoiceService } from "@/src/services/customer/invoice.service";
import { subscriptionService } from "@/src/services/customer/subscription.service";
import { financialService } from "@/src/services/customer/financial.service";
import { normalizeInvoice, subscriptionToUsage, userInfoToProfile } from "@/src/lib/customer/normalize";

export function useDashboard() {
  const userId = getStoredUserInfo()?.userId ?? "anonymous";

  return useQuery({
    queryKey: ["customer", "dashboard", userId],
    queryFn: async () => {
      const [subscription, invoicesPage, summary] = await Promise.all([
        subscriptionService.current(),
        invoiceService.list({ page: 0, size: 5 }),
        financialService.summary().catch(() => null),
      ]);
      const invoices = invoicesPage.items.map(normalizeInvoice);
      return {
        user: userInfoToProfile(getStoredUserInfo(), subscription),
        usage: subscriptionToUsage(subscription),
        subscription,
        invoices,
        quotations: [],
        expenses: [],
        summary,
        incomeExpenseSeries: [],
        invoiceStatusSeries: [],
      };
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: (query) => query.state.data?.invoices.some((invoice) => invoice.status === "PAYMENT_PROCESSING") ? 10_000 : false,
    refetchIntervalInBackground: false,
  });
}
