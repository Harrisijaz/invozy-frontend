import { DocumentDetail } from "@/components/invoice/document-detail";
import { PageHeader } from "@/components/shared/page-header";

export default async function QuotationDetailPage(props: PageProps<"/app/quotations/[id]">) {
  const { id } = await props.params;
  return (
    <div className="grid gap-6">
      <PageHeader title="Quotation Preview" description="Review quotation details and convert accepted work into an invoice." />
      <DocumentDetail id={id} type="quotation" />
    </div>
  );
}
