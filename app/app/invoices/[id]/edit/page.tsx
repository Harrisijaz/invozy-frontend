import { DocumentForm } from "@/components/invoice/document-form";
import { PageHeader } from "@/components/shared/page-header";

export default function EditInvoicePage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Edit Invoice" description="Only draft and unpaid invoices can be edited. Backend rules remain authoritative." />
      <DocumentForm type="invoice" />
    </div>
  );
}
