import { QuotationList } from "@/components/quotation/quotation-list";
import { PageHeader } from "@/components/shared/page-header";

export default function QuotationsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Quotations" description="Create, search, review, and convert accepted quotations to invoices." />
      <QuotationList />
    </div>
  );
}
