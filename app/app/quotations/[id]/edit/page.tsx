import { DocumentForm } from "@/components/invoice/document-form";
import { PageHeader } from "@/components/shared/page-header";

export default function EditQuotationPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Edit Quotation" description="Converted or expired quotations are locked from editing." />
      <DocumentForm type="quotation" />
    </div>
  );
}
