import { InvoiceList } from "@/components/invoice/invoice-list";
import { PageHeader } from "@/components/shared/page-header";

export default function InvoicesPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Invoices" description="Search, filter, view, edit, mark paid, download PDF, and manage invoice actions." />
      <InvoiceList />
    </div>
  );
}
