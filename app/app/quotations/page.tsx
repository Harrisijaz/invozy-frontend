import { QuotationList } from "@/components/quotation/quotation-list";
import { PageHeader } from "@/components/shared/page-header";

export default function QuotationsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Quotations" description="Create quotations, open a quotation by ID, download PDF, and convert to invoices." />
      <QuotationList />
    </div>
  );
}
