import { DocumentForm } from "@/components/invoice/document-form";
import { PageHeader } from "@/components/shared/page-header";

export default function NewInvoicePage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Create Invoice" description="Build an invoice manually or review an AI-generated draft before saving." />
      <DocumentForm type="invoice" />
    </div>
  );
}
