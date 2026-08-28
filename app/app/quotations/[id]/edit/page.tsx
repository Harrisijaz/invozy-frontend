import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

export default function EditQuotationPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Edit Quotation" description="Quotation editing is not available." />
      <Card>Use Create Quotation to make a new quotation.</Card>
    </div>
  );
}
