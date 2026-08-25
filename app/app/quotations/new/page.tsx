import { DocumentForm } from "@/components/invoice/document-form";
import { PageHeader } from "@/components/shared/page-header";

export default function NewQuotationPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Create Quotation" description="Reuse the same document builder for client quotations and future invoice conversion." />
      <DocumentForm type="quotation" />
    </div>
  );
}
